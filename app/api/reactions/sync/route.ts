import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, listingReactions } from "@/lib/db";
import { and, eq, inArray, isNotNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

const syncSchema = z.object({
  email: z.string().email().max(255),
  token: z.string().min(16).max(64),
  upserts: z
    .array(
      z.object({
        listingKey: z.string().min(4).max(64),
        reaction: z.enum(["interested", "loved", "will_contact"]),
        address: z.string().max(500).nullish(),
        price: z.number().int().nonnegative().max(2_000_000_000).nullish(),
        city: z.string().max(100).nullish(),
      })
    )
    .max(100)
    .default([]),
  removes: z.array(z.string().min(4).max(64)).max(100).default([]),
});

export async function POST(req: NextRequest) {
  let data: z.infer<typeof syncSchema>;
  try {
    data = syncSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = data.email.toLowerCase().trim();

  try {
    // The token acts as the visitor's bearer credential: it must match a
    // VERIFIED row for this email before any mutation is accepted.
    const owner = await db
      .select({ id: listingReactions.id, locale: listingReactions.locale })
      .from(listingReactions)
      .where(
        and(
          eq(listingReactions.email, email),
          eq(listingReactions.verifyToken, data.token),
          isNotNull(listingReactions.verifiedAt)
        )
      )
      .limit(1);
    if (!owner.length) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // No transaction — unsupported by the neon-http driver, and every
    // statement here is an idempotent upsert/delete that converges on retry.
    const now = new Date();
    for (const item of data.upserts) {
      await db
        .insert(listingReactions)
        .values({
          email,
          listingKey: item.listingKey,
          reaction: item.reaction,
          addressSnapshot: item.address ?? null,
          priceSnapshot: item.price ?? null,
          citySnapshot: item.city ?? null,
          locale: owner[0].locale,
          verifyToken: data.token,
          verifiedAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [listingReactions.email, listingReactions.listingKey],
          set: {
            reaction: item.reaction,
            addressSnapshot: item.address ?? null,
            priceSnapshot: item.price ?? null,
            citySnapshot: item.city ?? null,
            updatedAt: now,
          },
        });
    }
    if (data.removes.length) {
      await db
        .delete(listingReactions)
        .where(
          and(eq(listingReactions.email, email), inArray(listingReactions.listingKey, data.removes))
        );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/reactions/sync:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
