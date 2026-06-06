import { Suspense } from "react";
import type { Metadata } from "next";
import { Grid3x3, ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertiesMapWrapper from "@/components/properties/PropertiesMapWrapper";
import {
  searchProperties,
  deriveListingLabel,
  type SearchParams as MlsSearchParams,
  type StatusBucket,
} from "@/lib/mls";
import type { MapListing } from "@/components/properties/PropertiesMap";

export const dynamicParams = true;
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Properties Map — Leo Realty Capital Investments",
  description: "Browse Miami-area listings on an interactive map.",
};

type SearchParams = {
  type?: string;
  status?: string;
  price_min?: string;
  price_max?: string;
  beds?: string;
  baths?: string;
  sqft_min?: string;
  year_min?: string;
  pool?: string;
  waterfront?: string;
  garage?: string;
  include_pending?: string;
  city?: string;
  sort?: string;
  q?: string;
};

const ALLOWED_STATUS: StatusBucket[] = ["for_sale", "for_rent", "pending", "sold", "rented", "all"];
function statusBucket(raw: string | undefined): StatusBucket {
  if (!raw || !ALLOWED_STATUS.includes(raw as StatusBucket)) return "for_sale";
  return raw as StatusBucket;
}

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

type Props = { searchParams: Promise<SearchParams> };

export default async function PropertiesMapPage({ searchParams }: Props) {
  const t = await getTranslations("PropertiesPage");
  const params = await searchParams;
  const bucket = statusBucket(params.status);

  const mlsParams: MlsSearchParams = {
    statusBucket: bucket,
    propertyTypeKey: params.type && params.type !== "all" ? params.type : undefined,
    minPrice: num(params.price_min),
    maxPrice: num(params.price_max),
    minBeds: num(params.beds),
    minBaths: num(params.baths),
    minSqft: num(params.sqft_min),
    minYearBuilt: num(params.year_min),
    pool: flag(params.pool),
    waterfront: flag(params.waterfront),
    garage: flag(params.garage),
    includePending: flag(params.include_pending),
    city: params.city || undefined,
    q: params.q,
    sort: params.sort,
    top: 200,
  };

  let listings: MapListing[] = [];
  let mlsError: string | null = null;
  let total = 0;

  try {
    const result = await searchProperties(mlsParams);
    total = result.total;
    listings = result.listings
      .filter((l) => l.latitude !== null && l.longitude !== null)
      .map((l) => ({
        listingKey: l.listingKey,
        listPrice: l.listPrice,
        isLease: l.isLease,
        city: l.city,
        unparsedAddress: l.unparsedAddress,
        bedrooms: l.bedrooms,
        bathroomsTotal: l.bathroomsTotal,
        photoUrl: l.photos[0]?.url ?? null,
        latitude: l.latitude!,
        longitude: l.longitude!,
        statusLabel: deriveListingLabel(l),
      }));
  } catch (err) {
    mlsError = err instanceof Error ? err.message : "MLS search failed";
    console.error("Map page MLS error:", mlsError);
  }

  return (
    <div className="pt-24 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#C5A55A] transition-colors text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> {t("gridView")}
        </Link>

        <PropertyFilters currentParams={params} />

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-[#6B7280]">
            {t("showingNofM", { n: listings.length, total: total.toLocaleString() })}
          </div>
          <Link
            href={`/properties${
              Object.keys(params).length
                ? "?" + new URLSearchParams(params as Record<string, string>).toString()
                : ""
            }`}
            className="inline-flex items-center gap-2 bg-white border border-[#E8E4DE] hover:border-[#C5A55A]/40 text-[#0A1628] text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Grid3x3 className="w-4 h-4 text-[#C5A55A]" />
            {t("gridView")}
          </Link>
        </div>

        <div className="mt-4">
          {mlsError ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E4DE]">
              <p className="text-[#6B7280] font-semibold">Map unavailable right now.</p>
              <p className="text-[#6B7280]/70 text-sm mt-2">{mlsError}</p>
            </div>
          ) : (
            <Suspense>
              <PropertiesMapWrapper listings={listings} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
