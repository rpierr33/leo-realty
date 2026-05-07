import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NEIGHBORHOODS, getNeighborhoodBySlug } from "@/lib/neighborhoods";
import { searchProperties, formatPriceUSD } from "@/lib/mls";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://leorealtycapitalinvestments.com";

export function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({ slug: n.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = getNeighborhoodBySlug(slug);
  if (!n) return { title: "Neighborhood Not Found" };
  return {
    title: `Homes for Sale in ${n.name}, ${n.state} — Leo Realty`,
    description: `${n.description.slice(0, 155)}`.trim(),
    alternates: { canonical: `${SITE_URL}/neighborhoods/${n.slug}` },
  };
}

function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default async function NeighborhoodPage({ params }: Props) {
  const { slug } = await params;
  const n = getNeighborhoodBySlug(slug);
  if (!n) notFound();

  const t = await getTranslations("Neighborhood");

  // Try to fetch a few listings filtered to this neighborhood (best-effort).
  let listings: Awaited<ReturnType<typeof searchProperties>>["listings"] = [];
  try {
    const result = await searchProperties({ status: "Active", q: n.name, top: 6 });
    listings = result.listings;
  } catch {
    // MLS may not be activated yet — skip gracefully.
  }

  // Place schema for this neighborhood
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${n.name}, ${n.state}`,
    description: n.description,
    geo: { "@type": "GeoCoordinates", latitude: n.lat, longitude: n.lng },
    containedInPlace: { "@type": "AdministrativeArea", name: n.county },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJson(placeSchema) }}
      />

      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[#C5A55A] text-sm font-semibold tracking-wider uppercase mb-4">
            <MapPin className="w-4 h-4" />
            {t("label")} · {n.county}
          </div>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-5">
            {t("homesFor")}{" "}
            <span className="text-[#C5A55A]">
              {n.name}, {n.state}
            </span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">{n.vibe}</p>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-3xl font-bold text-[#0A1628] mb-6">
                {t("intro")}
              </h2>
              <p className="text-[#374151] text-lg leading-relaxed mb-10">
                {n.description}
              </p>

              <h3 className="font-playfair text-2xl font-bold text-[#0A1628] mb-5">
                {t("highlightsHeader")}
              </h3>
              <ul className="space-y-3 mb-10">
                {n.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 text-[#374151] leading-relaxed"
                  >
                    <span className="block w-2 h-2 rounded-full bg-[#C5A55A] flex-shrink-0 mt-2" />
                    {h}
                  </li>
                ))}
              </ul>

              <h3 className="font-playfair text-2xl font-bold text-[#0A1628] mb-5">
                {t("zipCodesHeader")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {n.zipCodes.map((z) => (
                  <span
                    key={z}
                    className="bg-white border border-[#E8E4DE] text-[#0A1628] text-sm font-semibold px-4 py-1.5 rounded-full"
                  >
                    {z}
                  </span>
                ))}
              </div>
            </div>

            <div>
              {listings.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E8E4DE] p-6">
                  <h3 className="font-playfair text-xl font-bold text-[#0A1628] mb-4">
                    {t("listingsHeader")} {n.name}
                  </h3>
                  <div className="space-y-4">
                    {listings.slice(0, 4).map((l) => (
                      <Link
                        key={l.listingKey}
                        href={`/properties/${encodeURIComponent(l.listingKey)}`}
                        className="block group"
                      >
                        <div className="flex items-center gap-3 pb-4 border-b border-[#E8E4DE] last:border-0">
                          <div className="flex-1 min-w-0">
                            <div className="text-[#C5A55A] font-bold text-sm">
                              {formatPriceUSD(l.listPrice)}
                            </div>
                            <div className="text-[#0A1628] text-sm font-medium truncate group-hover:text-[#C5A55A] transition-colors">
                              {l.unparsedAddress ?? l.city}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/properties?q=${encodeURIComponent(n.name)}`}
                    className="block text-center mt-5 text-sm font-semibold text-[#C5A55A] hover:underline"
                  >
                    {t("viewAllListings", { city: n.name })} →
                  </Link>
                </div>
              )}

              <div className="bg-[#0A1628] rounded-2xl p-6 mt-6">
                <h3 className="font-playfair text-xl font-bold text-white mb-3">
                  {t("ctaTitle", { city: n.name })}
                </h3>
                <p className="text-white/60 text-sm mb-5">{t("ctaSubcopy")}</p>
                <Link
                  href="/contact"
                  className="block text-center bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-6 py-3.5 rounded-full hover:bg-[#D4BA7A] transition-colors"
                >
                  {t("ctaButton")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
