import { NextRequest, NextResponse } from "next/server";
import { searchProperties, type SearchParams } from "@/lib/mls";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params: SearchParams = {
      status: searchParams.get("status") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      stateOrProvince: searchParams.get("state") ?? undefined,
      minPrice: parseNumberParam(searchParams.get("price_min")),
      maxPrice: parseNumberParam(searchParams.get("price_max")),
      minBeds: parseNumberParam(searchParams.get("beds")),
      minBaths: parseNumberParam(searchParams.get("baths")),
      propertyType: searchParams.get("type") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      top: parseNumberParam(searchParams.get("top")),
      skip: parseNumberParam(searchParams.get("skip")),
    };

    const result = await searchProperties(params);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown MLS error";
    console.error("GET /api/mls/search:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function parseNumberParam(raw: string | null): number | undefined {
  if (raw === null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}
