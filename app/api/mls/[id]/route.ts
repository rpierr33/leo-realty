import { NextRequest, NextResponse } from "next/server";
import { getProperty } from "@/lib/mls";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listing = await getProperty(id);
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(listing);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown MLS error";
    console.error("GET /api/mls/[id]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
