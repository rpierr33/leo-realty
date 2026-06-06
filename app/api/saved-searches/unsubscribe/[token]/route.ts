import { NextRequest, NextResponse } from "next/server";
import { db, savedSearches } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://leorealtycapitalinvestments.com";

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id"));

  if (!token || !Number.isFinite(id)) {
    return NextResponse.redirect(`${SITE_URL}/saved-searches/invalid`);
  }

  const rows = await db
    .select()
    .from(savedSearches)
    .where(eq(savedSearches.verifyToken, token))
    .limit(1);

  if (!rows.length || rows[0].id !== id) {
    return NextResponse.redirect(`${SITE_URL}/saved-searches/invalid`);
  }

  await db
    .update(savedSearches)
    .set({ unsubscribedAt: new Date(), updatedAt: new Date() })
    .where(eq(savedSearches.id, id));

  return NextResponse.redirect(`${SITE_URL}/saved-searches/unsubscribed`);
}
