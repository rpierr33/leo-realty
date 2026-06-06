import { NextRequest, NextResponse } from "next/server";
import { db, savedSearches } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const rows = await db
    .select()
    .from(savedSearches)
    .where(and(eq(savedSearches.id, numericId), eq(savedSearches.verifyToken, token)))
    .limit(1);

  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.delete(savedSearches).where(eq(savedSearches.id, numericId));
  return NextResponse.json({ ok: true });
}
