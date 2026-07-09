import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, listingReactions } from "@/lib/db";
import { requireAuth } from "@/lib/utils/auth-guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const rows = await db
    .select()
    .from(listingReactions)
    .orderBy(desc(listingReactions.updatedAt))
    .limit(1000);

  return NextResponse.json({ rows });
}
