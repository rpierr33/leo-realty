import { NextRequest, NextResponse } from "next/server";
import { db, savedSearches } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://leorealtycapitalinvestments.com";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!token || token.length < 16) {
    return NextResponse.redirect(`${SITE_URL}/saved-searches/invalid`);
  }

  const rows = await db
    .select()
    .from(savedSearches)
    .where(eq(savedSearches.verifyToken, token))
    .limit(1);

  if (!rows.length) {
    return NextResponse.redirect(`${SITE_URL}/saved-searches/invalid`);
  }

  const row = rows[0];
  if (!row.verifiedAt) {
    await db
      .update(savedSearches)
      .set({ verifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(savedSearches.id, row.id));
  }

  return NextResponse.redirect(`${SITE_URL}/saved-searches/${encodeURIComponent(token)}`);
}
