import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db, savedSearches } from "@/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { sendVerifyEmail } from "@/lib/saved-search-notify";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(255),
  params: z.record(z.string(), z.string()).default({}),
  frequency: z.enum(["instant", "daily", "weekly"]).default("instant"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, name, params, frequency } = parsed.data;

    // Idempotency: if same email + same params already exists, refresh the verify
    // token but don't create a duplicate row.
    const paramsKey = JSON.stringify(
      Object.fromEntries(Object.entries(params).sort(([a], [b]) => a.localeCompare(b)))
    );
    const existing = await db
      .select()
      .from(savedSearches)
      .where(and(eq(savedSearches.email, email.toLowerCase()), isNull(savedSearches.unsubscribedAt)))
      .limit(50);

    const dupe = existing.find(
      (s) =>
        JSON.stringify(
          Object.fromEntries(
            Object.entries(s.paramsJson as Record<string, string>).sort(([a], [b]) =>
              a.localeCompare(b)
            )
          )
        ) === paramsKey
    );

    const token = crypto.randomBytes(24).toString("hex");

    let savedSearchId: number;
    if (dupe) {
      await db
        .update(savedSearches)
        .set({
          name,
          frequency,
          verifyToken: token,
          updatedAt: new Date(),
        })
        .where(eq(savedSearches.id, dupe.id));
      savedSearchId = dupe.id;
    } else {
      const inserted = await db
        .insert(savedSearches)
        .values({
          email: email.toLowerCase(),
          name,
          paramsJson: params,
          frequency,
          verifyToken: token,
        })
        .returning({ id: savedSearches.id });
      savedSearchId = inserted[0].id;
    }

    // Fire-and-forget email send — never block the response.
    sendVerifyEmail({ email, searchName: name, token }).catch((err) =>
      console.error("[saved-searches] verify send failed:", err)
    );

    return NextResponse.json({ ok: true, id: savedSearchId });
  } catch (err) {
    console.error("POST /api/saved-searches:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
