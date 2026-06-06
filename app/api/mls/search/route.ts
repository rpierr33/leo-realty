import { NextRequest, NextResponse } from "next/server";
import { searchProperties, type SearchParams, type StatusBucket } from "@/lib/mls";

export const dynamic = "force-dynamic";

const ALLOWED_STATUS: StatusBucket[] = ["for_sale", "for_rent", "pending", "sold", "rented", "all"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const rawStatus = searchParams.get("status");
    const statusBucket: StatusBucket | undefined =
      rawStatus && ALLOWED_STATUS.includes(rawStatus as StatusBucket)
        ? (rawStatus as StatusBucket)
        : undefined;

    const params: SearchParams = {
      statusBucket,
      propertyTypeKey: searchParams.get("type") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      stateOrProvince: searchParams.get("state") ?? undefined,
      minPrice: parseNumberParam(searchParams.get("price_min")),
      maxPrice: parseNumberParam(searchParams.get("price_max")),
      minBeds: parseNumberParam(searchParams.get("beds")),
      minBaths: parseNumberParam(searchParams.get("baths")),
      minSqft: parseNumberParam(searchParams.get("sqft_min")),
      minYearBuilt: parseNumberParam(searchParams.get("year_min")),
      pool: parseFlagParam(searchParams.get("pool")),
      waterfront: parseFlagParam(searchParams.get("waterfront")),
      garage: parseFlagParam(searchParams.get("garage")),
      q: searchParams.get("q") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
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

function parseFlagParam(raw: string | null): boolean | undefined {
  if (!raw) return undefined;
  if (raw === "1" || raw === "true" || raw === "yes") return true;
  return undefined;
}
