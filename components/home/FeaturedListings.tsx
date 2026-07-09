import { ArrowRight, Bed, Bath, Ruler, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  searchProperties,
  formatPriceUSD,
  listingLabelKey,
  LEO_REALTY_OFFICE_ID,
  type MlsListing,
} from "@/lib/mls";

/**
 * Broker-Owned Listings — Leo Realty's OWN active listings (ListOfficeMlsId
 * = LEOT01), shown in their own clearly-labeled section so they read as
 * broker-owned, NOT conflated with the market-wide Premium or Good Deals
 * sections. Each card carries a "Leo Realty" badge to make ownership obvious.
 */
export default async function FeaturedListings() {
  const t = await getTranslations("FeaturedListings");
  const tProps = await getTranslations("PropertiesPage");

  // Pull Leo Realty's own active listings from MIAMI MLS, then rank for
  // visual quality: prefer listings with the most photos AND highest list
  // price within the active window. We over-fetch 30 newest, drop anything
  // without a photo, and surface the top 12 — newest + best photographed first.
  let listings: MlsListing[] = [];
  try {
    const result = await searchProperties({
      listOfficeMlsId: LEO_REALTY_OFFICE_ID,
      statusBucket: "all",
      sort: "newest",
      top: 30,
    });
    listings = result.listings
      .filter((l) => l.photos.length >= 1)
      .sort((a, b) => {
        // Composite rank: photo count (weight 1) + log price (weight 0.7).
        // Newest already came first from MLS; photo + price tie-break promotes
        // the most showroom-quality listings into the homepage hero grid.
        const scoreA = a.photos.length + (a.listPrice ? Math.log10(a.listPrice) * 0.7 : 0);
        const scoreB = b.photos.length + (b.listPrice ? Math.log10(b.listPrice) * 0.7 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 12);
  } catch (err) {
    console.error("FeaturedListings MLS error:", err);
  }

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="section-label">{t("label")}</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-medium text-[#0A1628] leading-tight">
              {t("headline1")}
              <br />
              {t("headline2")}
            </h2>
          </div>
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 text-[#0A1628] font-medium text-sm hover:text-[#C5A55A] transition-colors"
          >
            {t("viewAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 text-[#6B7280]">
            <p className="text-lg mb-3">{t("emptyTitle")}</p>
            <Link
              href="/contact"
              className="text-[#C5A55A] font-semibold underline underline-offset-4"
            >
              {t("emptyCta")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {listings.map((listing) => {
              const image = listing.photos[0]?.url;
              const statusLabel = tProps(listingLabelKey(listing) as "statusForSale");
              const title =
                listing.unparsedAddress ??
                [listing.city, listing.stateOrProvince].filter(Boolean).join(", ") ??
                t("emptyTitle");
              const locationLine = [listing.city, listing.stateOrProvince].filter(Boolean).join(", ");

              return (
                <Link
                  key={listing.listingKey}
                  href={`/properties/${encodeURIComponent(listing.listingKey)}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#E8E4DE] mb-5">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#E8E4DE]">
                        <span className="text-[#0A1628]/20 text-5xl font-playfair">L</span>
                      </div>
                    )}

                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#C5A55A] text-[#0A1628] text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      {t("ourBadge")}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#0A1628] text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      {statusLabel}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#C5A55A] font-medium text-xl mb-1">
                      {formatPriceUSD(listing.listPrice, listing.isLease)}
                    </div>

                    <h3 className="font-playfair font-medium text-[#0A1628] text-lg leading-snug mb-2 group-hover:text-[#C5A55A] transition-colors duration-200 line-clamp-1">
                      {title}
                    </h3>

                    <div className="flex items-center gap-1 text-[#9CA3AF] text-sm mb-3">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{locationLine}</span>
                    </div>

                    <div className="flex items-center gap-5 text-[#6B7280] text-sm pt-3 border-t border-[#E8E4DE]">
                      {listing.bedrooms !== null && listing.bedrooms > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5" />
                          {listing.bedrooms} {t("beds")}
                        </span>
                      )}
                      {listing.bathroomsTotal !== null && listing.bathroomsTotal > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Bath className="w-3.5 h-3.5" />
                          {listing.bathroomsTotal} {t("baths")}
                        </span>
                      )}
                      {listing.livingArea !== null && listing.livingArea > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5" />
                          {listing.livingArea.toLocaleString()} {t("sqft")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/properties"
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
