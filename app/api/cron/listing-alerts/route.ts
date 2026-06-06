import { NextRequest, NextResponse } from "next/server";
import { db, savedSearches } from "@/lib/db";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { searchProperties, type SearchParams as MlsSearchParams, type StatusBucket } from "@/lib/mls";
import { sendListingAlertEmail } from "@/lib/saved-search-notify";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ALLOWED_STATUS: StatusBucket[] = ["for_sale", "for_rent", "pending", "sold", "rented", "all"];

function num(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function flag(value: string | undefined): boolean | undefined {
  if (!value) return undefined;
  if (value === "1" || value === "true" || value === "yes") return true;
  return undefined;
}

function paramsToMls(p: Record<string, string>): MlsSearchParams {
  const rawStatus = p.status;
  const statusBucket =
    rawStatus && ALLOWED_STATUS.includes(rawStatus as StatusBucket)
      ? (rawStatus as StatusBucket)
      : "for_sale";
  return {
    statusBucket,
    propertyTypeKey: p.type && p.type !== "all" ? p.type : undefined,
    city: p.city || undefined,
    minPrice: num(p.price_min),
    maxPrice: num(p.price_max),
    minBeds: num(p.beds),
    minBaths: num(p.baths),
    minSqft: num(p.sqft_min),
    minYearBuilt: num(p.year_min),
    pool: flag(p.pool),
    waterfront: flag(p.waterfront),
    garage: flag(p.garage),
    q: p.q,
    sort: "newest",
    top: 50,
  };
}

function shouldRun(frequency: string, lastNotifiedAt: Date | null): boolean {
  if (!lastNotifiedAt) return true;
  const ageMs = Date.now() - lastNotifiedAt.getTime();
  if (frequency === "instant") return ageMs >= 50 * 60 * 1000; // ≥ 50 min
  if (frequency === "daily") return ageMs >= 23.5 * 60 * 60 * 1000; // ≥ 23.5 h
  if (frequency === "weekly") return ageMs >= 6.5 * 24 * 60 * 60 * 1000; // ≥ 6.5 days
  return true;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await db
    .select()
    .from(savedSearches)
    .where(
      and(
        isNotNull(savedSearches.verifiedAt),
        isNull(savedSearches.unsubscribedAt)
      )
    );

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const search of candidates) {
    if (!shouldRun(search.frequency, search.lastNotifiedAt)) {
      skipped++;
      continue;
    }
    try {
      const params = paramsToMls(search.paramsJson as Record<string, string>);
      const result = await searchProperties(params);

      // Filter to listings modified since lastNotifiedAt (only new ones).
      const baseline = search.lastNotifiedAt ?? new Date(Date.now() - 24 * 60 * 60 * 1000);
      const newListings = result.listings.filter((l) => {
        if (!l.modifiedAt) return false;
        return new Date(l.modifiedAt) > baseline;
      });

      if (newListings.length > 0 && search.verifyToken) {
        await sendListingAlertEmail({
          email: search.email,
          searchName: search.name,
          searchId: search.id,
          listings: newListings,
          manageToken: search.verifyToken,
        });
        sent++;
      }

      // Update lastNotifiedAt regardless — prevents replaying the same window
      // if zero new listings (otherwise frequency-throttle is bypassed).
      await db
        .update(savedSearches)
        .set({ lastNotifiedAt: new Date(), updatedAt: new Date() })
        .where(eq(savedSearches.id, search.id));
    } catch (err) {
      errors++;
      console.error(`[cron/listing-alerts] search ${search.id} failed:`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    candidates: candidates.length,
    sent,
    skipped,
    errors,
    ranAt: new Date().toISOString(),
  });
}
