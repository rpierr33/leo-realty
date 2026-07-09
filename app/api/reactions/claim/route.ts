import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db, listingReactions } from "@/lib/db";
import { and, eq, gte, sql } from "drizzle-orm";
import { sendReactionVerifyEmail, type ReactionItem } from "@/lib/reaction-notify";

export const dynamic = "force-dynamic";

const itemSchema = z.object({
  listingKey: z.string().min(4).max(64),
  reaction: z.enum(["interested", "loved", "will_contact"]),
  address: z.string().max(500).nullish(),
  price: z.number().int().nonnegative().max(2_000_000_000).nullish(),
  city: z.string().max(100).nullish(),
});

const claimSchema = z.object({
  email: z.string().email().max(255),
  locale: z.enum(["en", "fr", "ht", "es"]).default("en"),
  items: z.array(itemSchema).min(1).max(100),
  // Honeypot — humans never see this field.
  website: z.string().max(500).optional(),
});

const PER_EMAIL_WINDOW_SEC = 60;
const GLOBAL_WINDOW_SEC = 60;
const GLOBAL_MAX_CLAIMS = 30;

export async function POST(req: NextRequest) {
  let data: z.infer<typeof claimSchema>;
  try {
    data = claimSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: pretend success, store nothing.
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = data.email.toLowerCase().trim();

  try {
    // Per-email rate limit: one claim/minute is plenty for a human re-click.
    const emailWindow = new Date(Date.now() - PER_EMAIL_WINDOW_SEC * 1000);
    const recent = await db
      .select({ id: listingReactions.id })
      .from(listingReactions)
      .where(and(eq(listingReactions.email, email), gte(listingReactions.updatedAt, emailWindow)))
      .limit(1);
    if (recent.length > 0) {
      return NextResponse.json({ ok: true, throttled: true });
    }

    // Global flood guard.
    const globalWindow = new Date(Date.now() - GLOBAL_WINDOW_SEC * 1000);
    const [{ flood = 0 } = { flood: 0 }] = await db
      .select({ flood: sql<number>`count(distinct ${listingReactions.email})::int` })
      .from(listingReactions)
      .where(gte(listingReactions.createdAt, globalWindow));
    if (flood >= GLOBAL_MAX_CLAIMS) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(GLOBAL_WINDOW_SEC) } }
      );
    }

    // One token covers the visitor's whole list; a re-claim rotates it.
    const token = crypto.randomBytes(24).toString("hex");
    const now = new Date();

    // Idempotent per (email, listingKey): re-claims update the reaction and
    // snapshots instead of duplicating rows. No transaction — the neon-http
    // driver doesn't support them, and it isn't needed: every statement is an
    // idempotent upsert, so a partially-applied batch converges on retry.
    for (const item of data.items) {
      await db
        .insert(listingReactions)
        .values({
          email,
          listingKey: item.listingKey,
          reaction: item.reaction,
          addressSnapshot: item.address ?? null,
          priceSnapshot: item.price ?? null,
          citySnapshot: item.city ?? null,
          locale: data.locale,
          verifyToken: token,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [listingReactions.email, listingReactions.listingKey],
          set: {
            reaction: item.reaction,
            addressSnapshot: item.address ?? null,
            priceSnapshot: item.price ?? null,
            citySnapshot: item.city ?? null,
            locale: data.locale,
            verifyToken: token,
            updatedAt: now,
          },
        });
    }
    // The rotated token must open the FULL list, including rows from
    // earlier claims that weren't in this payload.
    await db
      .update(listingReactions)
      .set({ verifyToken: token, updatedAt: now })
      .where(eq(listingReactions.email, email));

    const items: ReactionItem[] = data.items.map((i) => ({
      listingKey: i.listingKey,
      reaction: i.reaction,
      address: i.address ?? null,
      price: i.price ?? null,
      city: i.city ?? null,
    }));

    after(async () => {
      await sendReactionVerifyEmail({ email, locale: data.locale, token, items });
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/reactions/claim:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
