import { Metadata } from "next";
import Link from "next/link";
import { Bed, Bath, Ruler, MapPin, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { properties, agents } from "@/lib/db/schema";
import { eq, and, gte, lte, ilike, or, SQL } from "drizzle-orm";
import { formatPrice } from "@/lib/utils/format";
import PropertyFilters from "@/components/properties/PropertyFilters";

export const metadata: Metadata = {
  title: "Properties — Buy, Sell & Rent in South Florida",
  description:
    "Browse Leo Realty's property listings. Find homes for sale, rent, and investment properties throughout South Florida.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  type?: string;
  status?: string;
  price_min?: string;
  price_max?: string;
  beds?: string;
  baths?: string;
  q?: string;
};

type PropertyType = "residential" | "condo" | "townhouse" | "commercial" | "multi_family" | "land" | "investment";
type PropertyStatus = "for_sale" | "for_rent" | "pending" | "sold" | "rented";

const VALID_TYPES: PropertyType[] = ["residential", "condo", "townhouse", "commercial", "multi_family", "land", "investment"];
const VALID_STATUSES: PropertyStatus[] = ["for_sale", "for_rent", "pending", "sold", "rented"];

async function getProperties(params: SearchParams) {
  try {
    const filters: SQL[] = [eq(properties.isPublished, true)];

    const type = params.type && params.type !== "all" ? params.type : null;
    const status = params.status && params.status !== "all" ? params.status : null;

    if (type && (VALID_TYPES as string[]).includes(type)) {
      filters.push(eq(properties.propertyType, type as PropertyType));
    }
    if (status && (VALID_STATUSES as string[]).includes(status)) {
      filters.push(eq(properties.status, status as PropertyStatus));
    }
    if (params.price_min) {
      filters.push(gte(properties.price, params.price_min));
    }
    if (params.price_max) {
      filters.push(lte(properties.price, params.price_max));
    }
    if (params.beds) {
      const bedsNum = parseInt(params.beds);
      if (!isNaN(bedsNum)) filters.push(gte(properties.bedrooms, bedsNum));
    }
    if (params.baths) {
      const bathsNum = parseInt(params.baths);
      if (!isNaN(bathsNum)) filters.push(gte(properties.bathrooms, bathsNum));
    }
    if (params.q && params.q.trim()) {
      const pattern = `%${params.q.trim()}%`;
      filters.push(
        or(
          ilike(properties.title, pattern),
          ilike(properties.city, pattern),
          ilike(properties.address, pattern)
        )!
      );
    }

    return await db
      .select({
        id: properties.id,
        slug: properties.slug,
        title: properties.title,
        price: properties.price,
        status: properties.status,
        propertyType: properties.propertyType,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        sqft: properties.sqft,
        address: properties.address,
        city: properties.city,
        state: properties.state,
        images: properties.images,
        isFeatured: properties.isFeatured,
        agentName: agents.name,
      })
      .from(properties)
      .leftJoin(agents, eq(properties.agentId, agents.id))
      .where(and(...filters))
      .orderBy(properties.createdAt);
  } catch (err) {
    console.error("getProperties error:", err);
    return [];
  }
}

const STATUS_CONFIG: Record<string, { label: string }> = {
  for_sale: { label: "For Sale" },
  for_rent: { label: "For Rent" },
  pending: { label: "Pending" },
  sold: { label: "Sold" },
  rented: { label: "Rented" },
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const listings = await getProperties(params);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">Properties</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-5">
            Find Your Perfect Property
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Browse our curated selection of residential, commercial, and investment
            properties throughout South Florida.
          </p>
          <div className="mt-6 flex items-center gap-2 text-[#C5A55A] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C5A55A]" />
            {listings.length} {listings.length === 1 ? "Property" : "Properties"} Available
          </div>
        </div>
      </section>

      {/* Filters + Listings */}
      <section className="py-16 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filter bar (client component) */}
          <PropertyFilters currentParams={params} />

          {/* Results */}
          <div className="mt-8">
            {listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E4DE]">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[#6B7280] text-lg mb-2 font-semibold">No properties match your search</p>
                <p className="text-[#6B7280]/70 text-sm mb-6">Try adjusting your filters or browse all listings</p>
                <Link href="/properties" className="text-[#C5A55A] font-semibold underline underline-offset-4">
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => {
                  const image = listing.images?.[0]?.url;
                  const statusLabel = STATUS_CONFIG[listing.status]?.label ?? listing.status;
                  const isRent = listing.status === "for_rent";

                  return (
                    <Link
                      key={listing.id}
                      href={`/properties/${listing.slug}`}
                      className="group block bg-white rounded-2xl overflow-hidden border border-[#E8E4DE] hover:border-[#C5A55A]/30 hover:shadow-2xl hover:shadow-[#0A1628]/8 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden bg-[#0A1628]/5">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={listing.title}
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

                        {listing.isFeatured && (
                          <div className="absolute top-4 right-4 bg-[#C5A55A] text-[#0A1628] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                            Featured
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4">
                          <div className="text-[#C5A55A] font-bold text-xl leading-none">
                            {formatPrice(listing.price)}
                            {isRent && <span className="text-sm font-normal text-white/70">/mo</span>}
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5">
                        <h3 className="font-playfair font-bold text-[#0A1628] text-lg mb-2 group-hover:text-[#C5A55A] transition-colors duration-200 line-clamp-1">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[#6B7280] text-xs mb-4">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{listing.address}, {listing.city}, {listing.state}</span>
                        </div>
                        <div className="flex items-center gap-5 text-[#6B7280] text-sm pt-3 border-t border-[#E8E4DE]">
                          {listing.bedrooms > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Bed className="w-3.5 h-3.5" />
                              {listing.bedrooms}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Bath className="w-3.5 h-3.5" />
                            {listing.bathrooms}
                          </span>
                          {listing.sqft && (
                            <span className="flex items-center gap-1.5">
                              <Ruler className="w-3.5 h-3.5" />
                              {listing.sqft.toLocaleString()} sf
                            </span>
                          )}
                          {listing.agentName && (
                            <span className="ml-auto text-[10px] text-[#6B7280]/60 truncate">{listing.agentName}</span>
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

      {/* CTA */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2">
              Don&apos;t See What You&apos;re Looking For?
            </h2>
            <p className="text-white/50 text-sm">
              Our agents have access to unlisted properties. Let us find your perfect match.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-8 py-4 rounded-full hover:bg-[#D4BA7A] transition-colors whitespace-nowrap"
          >
            Contact An Agent
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
