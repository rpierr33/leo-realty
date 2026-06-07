import { ArrowRight, Bed, Bath, Ruler, MapPin, TrendingDown, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  searchProperties,
  formatPriceUSD,
  listingLabelKey,
  type MlsListing,
} from "@/lib/mls";

/**
 * Market-wide "Best Deals & Newest" section (NOT limited to LEO Realty).
 *
 * Two columns of cards:
 * 1. Best Deals — Active sale listings ranked by lowest price-per-sqft
 *    (a reliable proxy for "value" — assumes the lower $/sqft within a
 *    livable size band, the better the deal vs the market median).
 * 2. Just Listed — Active listings by ModificationTimestamp desc.
 *
 * Both pools are filtered to Active sale + ≥800 sqft + ≥1 photo to avoid
 * land/junk/missing-data records polluting the homepage.
 */

const MIN_SQFT = 800;
const MAX_PRICE_FOR_DEALS = 1_500_000; // cap to filter luxury outliers
const CARDS_PER_COLUMN = 4;

async function fetchBestDeals(): Promise<MlsListing[]> {
  try {
    const { listings } = await searchProperties({
      statusBucket: "for_sale",
      minSqft: MIN_SQFT,
      maxPrice: MAX_PRICE_FOR_DEALS,
      sort: "price_asc",
      top: 60,
    });
    return listings
      .filter(
        (l) => l.photos.length >= 1 && l.listPrice && l.livingArea && l.livingArea >= MIN_SQFT
      )
      .map((l) => ({ ...l, _ppsf: (l.listPrice as number) / (l.livingArea as number) }))
      .sort((a, b) => (a as { _ppsf: number })._ppsf - (b as { _ppsf: number })._ppsf)
      .slice(0, CARDS_PER_COLUMN);
  } catch (err) {
    console.error("BestDeals fetch error:", err);
    return [];
  }
}

async function fetchNewest(): Promise<MlsListing[]> {
  try {
    const { listings } = await searchProperties({
      statusBucket: "for_sale",
      minSqft: MIN_SQFT,
      sort: "newest",
      top: 20,
    });
    return listings.filter((l) => l.photos.length >= 1).slice(0, CARDS_PER_COLUMN);
  } catch (err) {
    console.error("Newest fetch error:", err);
    return [];
  }
}

function ListingCard({
  listing,
  badge,
  badgeIcon,
  tProps,
  t,
  tBeds,
  tBaths,
  tSqft,
}: {
  listing: MlsListing;
  badge: string;
  badgeIcon: React.ReactNode;
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
          {badgeIcon}
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

  const [deals, newest] = await Promise.all([fetchBestDeals(), fetchNewest()]);

  if (deals.length === 0 && newest.length === 0) return null;

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
            href="/properties?status=for_sale&sort=newest"
            className="group inline-flex items-center gap-2 text-[#0A1628] font-medium text-sm hover:text-[#C5A55A] transition-colors flex-shrink-0"
          >
            {t("viewAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Best Deals row */}
        {deals.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <TrendingDown className="w-5 h-5 text-[#C5A55A]" />
              <h3 className="font-playfair text-xl font-semibold text-[#0A1628]">{t("tabBest")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {deals.map((listing) => (
                <ListingCard
                  key={listing.listingKey}
                  listing={listing}
                  badge={t("priceTag")}
                  badgeIcon={<TrendingDown className="w-3 h-3" />}
                  tProps={tProps}
                  t={t}
                  tBeds={t("beds")}
                  tBaths={t("baths")}
                  tSqft={t("sqft")}
                />
              ))}
            </div>
          </div>
        )}

        {/* Newest row */}
        {newest.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-[#C5A55A]" />
              <h3 className="font-playfair text-xl font-semibold text-[#0A1628]">{t("tabNewest")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newest.map((listing) => (
                <ListingCard
                  key={listing.listingKey}
                  listing={listing}
                  badge={t("newTag")}
                  badgeIcon={<Sparkles className="w-3 h-3" />}
                  tProps={tProps}
                  t={t}
                  tBeds={t("beds")}
                  tBaths={t("baths")}
                  tSqft={t("sqft")}
                />
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-14">
          <Link
            href="/properties?status=for_sale"
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
