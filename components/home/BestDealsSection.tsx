import { ArrowRight, Bed, Bath, Ruler, MapPin, TrendingDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  searchProperties,
  formatPriceUSD,
  listingLabelKey,
  type MlsListing,
} from "@/lib/mls";

/**
 * Good Deals on the MLS — market-wide value section (NOT limited to Leo Realty).
 *
 * Active for-sale homes ranked by lowest price-per-sqft (a reliable proxy for
 * "value" — the lower the $/sqft within a livable size band, the better the deal
 * vs the market). A $50k price FLOOR plus the MLS-layer test/"do-not-post"
 * exclusion keep mispriced junk (e.g. a $99 "home") out of the showcase, so
 * every price shown makes sense.
 */

const MIN_SQFT = 800;
const MIN_PRICE_FOR_DEALS = 50_000; // floor out mispriced / test records
const MAX_PRICE_FOR_DEALS = 1_500_000; // cap luxury outliers (those belong in Premium)
const CARDS = 8;

async function fetchBestDeals(): Promise<MlsListing[]> {
  try {
    const { listings } = await searchProperties({
      statusBucket: "for_sale",
      propertyTypeKey: "residential", // real homes/condos, not land or commercial
      minPrice: MIN_PRICE_FOR_DEALS,
      maxPrice: MAX_PRICE_FOR_DEALS,
      minSqft: MIN_SQFT,
      sort: "price_asc",
      top: 80,
    });
    return listings
      .filter(
        (l) => l.photos.length >= 1 && l.listPrice && l.livingArea && l.livingArea >= MIN_SQFT
      )
      .map((l) => ({ ...l, _ppsf: (l.listPrice as number) / (l.livingArea as number) }))
      .sort((a, b) => (a as { _ppsf: number })._ppsf - (b as { _ppsf: number })._ppsf)
      .slice(0, CARDS);
  } catch (err) {
    console.error("BestDeals fetch error:", err);
    return [];
  }
}

function ListingCard({
  listing,
  badge,
  tProps,
  t,
  tBeds,
  tBaths,
  tSqft,
}: {
  listing: MlsListing;
  badge: string;
  tProps: (k: "statusForSale") => string;
  t: (k: "pricePerSqft", v?: Record<string, string | number>) => string;
  tBeds: string;
  tBaths: string;
  tSqft: string;
}) {
  const image = listing.photos[0]?.url;
  const title =
    listing.unparsedAddress ??
    [listing.city, listing.stateOrProvince].filter(Boolean).join(", ") ??
    "Listing";
  const locationLine = [listing.city, listing.stateOrProvince].filter(Boolean).join(", ");
  const ppsf =
    listing.listPrice && listing.livingArea
      ? Math.round(listing.listPrice / listing.livingArea)
      : null;
  const statusLabel = tProps(listingLabelKey(listing) as "statusForSale");

  return (
    <Link
      href={`/properties/${encodeURIComponent(listing.listingKey)}`}
      className="group block bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden hover:border-[#C5A55A]/40 hover:shadow-xl hover:shadow-[#0A1628]/8 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E4DE]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#0A1628]/20 text-5xl font-playfair">L</span>
          </div>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#0A1628] text-[#C5A55A] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
          <TrendingDown className="w-3 h-3" />
          {badge}
        </div>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#0A1628] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
          {statusLabel}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-[#C5A55A] font-bold text-lg leading-none">
            {formatPriceUSD(listing.listPrice, listing.isLease)}
          </div>
          {ppsf && (
            <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
              {t("pricePerSqft", { value: ppsf })}
            </div>
          )}
        </div>
        <h3 className="font-playfair font-medium text-[#0A1628] text-base leading-snug mb-1.5 line-clamp-1 group-hover:text-[#C5A55A] transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-[#9CA3AF] text-xs mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{locationLine}</span>
        </div>
        <div className="flex items-center gap-3 text-[#6B7280] text-xs pt-2 border-t border-[#E8E4DE]">
          {listing.bedrooms !== null && listing.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-3 h-3" />
              {listing.bedrooms} {tBeds}
            </span>
          )}
          {listing.bathroomsTotal !== null && listing.bathroomsTotal > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              {listing.bathroomsTotal} {tBaths}
            </span>
          )}
          {listing.livingArea !== null && listing.livingArea > 0 && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {listing.livingArea.toLocaleString()} {tSqft}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function BestDealsSection() {
  const t = await getTranslations("BestDeals");
  const tProps = await getTranslations("PropertiesPage");

  const deals = await fetchBestDeals();

  if (deals.length === 0) return null;

  return (
    <section className="py-24 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label">{t("label")}</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-medium text-[#0A1628] leading-tight">
              {t("headline1")}
              <br />
              {t("headline2")}
            </h2>
            <p className="text-[#6B7280] text-base mt-3 max-w-2xl leading-relaxed">{t("subcopy")}</p>
          </div>
          <Link
            href="/properties?status=for_sale&sort=price_asc"
            className="group inline-flex items-center gap-2 text-[#0A1628] font-medium text-sm hover:text-[#C5A55A] transition-colors flex-shrink-0"
          >
            {t("viewAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((listing) => (
            <ListingCard
              key={listing.listingKey}
              listing={listing}
              badge={t("priceTag")}
              tProps={tProps}
              t={t}
              tBeds={t("beds")}
              tBaths={t("baths")}
              tSqft={t("sqft")}
            />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/properties?status=for_sale&sort=price_asc"
            className="inline-flex items-center gap-2 border border-[#0A1628]/20 text-[#0A1628] font-medium text-sm px-8 py-3.5 rounded-full hover:bg-[#0A1628] hover:text-white hover:border-[#0A1628] transition-all duration-200"
          >
            {t("browseAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
