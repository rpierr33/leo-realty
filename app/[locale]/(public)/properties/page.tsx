import type { Metadata } from "next";
import { Bed, Bath, Ruler, MapPin, ArrowRight, Map, Info } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PropertyFilters from "@/components/properties/PropertyFilters";
import SaveSearchButton from "@/components/properties/SaveSearchButton";
import {
  searchProperties,
  formatPriceUSD,
  listingLabelKey,
  type SearchParams as MlsSearchParams,
  type StatusBucket,
} from "@/lib/mls";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("propertiesTitle"), description: t("propertiesDescription") };
}

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

export default async function PropertiesPage({ searchParams }: Props) {
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
    top: 60,
  };

  let listings: Awaited<ReturnType<typeof searchProperties>>["listings"] = [];
  let total = 0;
  let mlsError: string | null = null;

  try {
    const result = await searchProperties(mlsParams);
    listings = result.listings;
    total = result.total;
  } catch (err) {
    mlsError = err instanceof Error ? err.message : "MLS search failed";
    console.error("Properties page MLS error:", mlsError);
  }

  const hasFilters = Object.entries(params).some(([k, v]) => v && v !== "all" && k !== "sort");

  return (
    <>
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">{t("label")}</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-5">
            {t("title")}
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">{t("subcopy")}</p>
          <div className="mt-6 flex items-center gap-2 text-[#C5A55A] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C5A55A]" />
            {total.toLocaleString()}{" "}
            {total === 1 ? t("listingSingular") : t("listingPlural")} {t("listingsAvailable")}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <PropertyFilters currentParams={params} />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/properties/map${
                  hasFilters
                    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
                    : ""
                }`}
                className="inline-flex items-center gap-2 bg-white border border-[#E8E4DE] hover:border-[#C5A55A]/40 text-[#0A1628] text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Map className="w-4 h-4 text-[#C5A55A]" />
                {t("mapView")}
              </Link>
              {hasFilters && <SaveSearchButton params={params} />}
            </div>
            <div className="text-xs text-[#6B7280]">
              {t("showingNofM", { n: listings.length, total: total.toLocaleString() })}
            </div>
          </div>

          {/* IDX FYI — explains why our public count differs from the agent-facing MLS */}
          <div className="mt-3 flex items-start gap-3 bg-[#FAF8F5] border border-[#E8E4DE] rounded-xl p-4">
            <Info className="w-4 h-4 text-[#C5A55A] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#0A1628] mb-1">{t("idxFyiTitle")}</div>
              <p className="text-xs text-[#6B7280] leading-relaxed">{t("idxFyiBody")}</p>
            </div>
          </div>

          <div className="mt-6">
            {mlsError ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E4DE]">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[#6B7280] text-lg mb-2 font-semibold">{t("errorTitle")}</p>
                <p className="text-[#6B7280]/70 text-sm mb-6">{t("errorSubtitle")}</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E4DE]">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[#6B7280] text-lg mb-2 font-semibold">{t("noResultsTitle")}</p>
                <p className="text-[#6B7280]/70 text-sm mb-6">{t("noResultsSubtitle")}</p>
                <Link
                  href="/properties"
                  className="text-[#C5A55A] font-semibold underline underline-offset-4"
                >
                  {t("clearFilters")}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => {
                  const image = listing.photos[0]?.url;
                  const statusLabel = t(listingLabelKey(listing) as "statusForSale");
                  const title =
                    listing.unparsedAddress ??
                    [listing.city, listing.stateOrProvince].filter(Boolean).join(", ") ??
                    t("listingSingular");
                  const locationLine = [listing.city, listing.stateOrProvince, listing.postalCode]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <Link
                      key={listing.listingKey}
                      href={`/properties/${encodeURIComponent(listing.listingKey)}`}
                      className="group block bg-white rounded-2xl overflow-hidden border border-[#E8E4DE] hover:border-[#C5A55A]/30 hover:shadow-2xl hover:shadow-[#0A1628]/8 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="relative h-56 overflow-hidden bg-[#0A1628]/5">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0A1628]/5">
                            <span className="font-playfair text-[#0A1628]/20 text-5xl">L</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/50 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#0A1628] text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                          {statusLabel}
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <div className="text-[#C5A55A] font-bold text-xl leading-none">
                            {formatPriceUSD(listing.listPrice, listing.isLease)}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-playfair font-bold text-[#0A1628] text-lg mb-2 group-hover:text-[#C5A55A] transition-colors duration-200 line-clamp-1">
                          {title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[#6B7280] text-xs mb-4">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{locationLine || t("addressOnRequest")}</span>
                        </div>
                        <div className="flex items-center gap-5 text-[#6B7280] text-sm pt-3 border-t border-[#E8E4DE]">
                          {listing.bedrooms !== null && listing.bedrooms > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Bed className="w-3.5 h-3.5" />
                              {listing.bedrooms}
                            </span>
                          )}
                          {listing.bathroomsTotal !== null && listing.bathroomsTotal > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Bath className="w-3.5 h-3.5" />
                              {listing.bathroomsTotal}
                            </span>
                          )}
                          {listing.livingArea !== null && listing.livingArea > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Ruler className="w-3.5 h-3.5" />
                              {listing.livingArea.toLocaleString()} sf
                            </span>
                          )}
                          {listing.listingOfficeName && (
                            <span className="ml-auto text-[10px] text-[#6B7280]/60 truncate">
                              {listing.listingOfficeName}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2">
              {t("ctaTitle")}
            </h2>
            <p className="text-white/50 text-sm">{t("ctaSubcopy")}</p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-8 py-4 rounded-full hover:bg-[#D4BA7A] transition-colors whitespace-nowrap"
          >
            {t("ctaButton")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
