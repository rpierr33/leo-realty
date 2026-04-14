import Link from "next/link";
import { ArrowRight, Bed, Bath, Ruler, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { properties, agents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { formatPrice } from "@/lib/utils/format";

async function getFeaturedProperties() {
  try {
    const rows = await db
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
      .where(and(eq(properties.isFeatured, true), eq(properties.isPublished, true)))
      .limit(6);
    return rows;
  } catch {
    return [];
  }
}

const FALLBACK_LISTINGS = [
  {
    id: 1,
    slug: "luxury-waterfront-miami",
    title: "Luxury Waterfront Estate",
    price: "1250000",
    status: "for_sale" as const,
    propertyType: "residential" as const,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3800,
    address: "123 Ocean Drive",
    city: "Miami Beach",
    state: "FL",
    images: [{ url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=85", caption: "", order: 0 }],
    isFeatured: true,
    agentName: "Leopold Evariste",
  },
  {
    id: 2,
    slug: "modern-condo-brickell",
    title: "Modern Brickell Condo",
    price: "485000",
    status: "for_sale" as const,
    propertyType: "condo" as const,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    address: "456 Brickell Ave",
    city: "Miami",
    state: "FL",
    images: [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=85", caption: "", order: 0 }],
    isFeatured: true,
    agentName: "Carly Cadet",
  },
  {
    id: 3,
    slug: "family-home-aventura",
    title: "Spacious Family Home",
    price: "680000",
    status: "for_sale" as const,
    propertyType: "residential" as const,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2600,
    address: "789 Aventura Blvd",
    city: "Aventura",
    state: "FL",
    images: [{ url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=85", caption: "", order: 0 }],
    isFeatured: true,
    agentName: "Jean Samuel Luxama",
  },
];

const STATUS_LABELS: Record<string, { label: string }> = {
  for_sale: { label: "For Sale" },
  for_rent: { label: "For Rent" },
  pending: { label: "Pending" },
  sold: { label: "Sold" },
  rented: { label: "Rented" },
};

export default async function FeaturedListings() {
  const listings = await getFeaturedProperties();
  const displayListings = listings.length > 0 ? listings : FALLBACK_LISTINGS;

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="section-label">Featured Listings</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-bold text-[#0A1628] leading-tight">
              Premium South Florida
              <br />
              Properties
            </h2>
          </div>
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 text-[#0A1628] font-semibold text-sm hover:text-[#C5A55A] transition-colors"
          >
            View All Properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {displayListings.length === 0 ? (
          <div className="text-center py-20 text-[#6B7280]">
            <p className="text-lg mb-3">No featured properties at this time.</p>
            <Link href="/contact" className="text-[#C5A55A] font-semibold underline underline-offset-4">
              Contact us to find your perfect home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayListings.map((listing, index) => {
              const image = listing.images?.[0]?.url;
              const statusLabel = STATUS_LABELS[listing.status]?.label ?? listing.status;
              const isRent = listing.status === "for_rent";

              return (
                <Link
                  key={listing.id}
                  href={`/properties/${listing.slug}`}
                  className={`group block rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0A1628]/10 ${
                    index === 0 ? "md:col-span-2 md:row-span-1" : ""
                  }`}
                >
                  {/* Image — dominant */}
                  <div className={`relative overflow-hidden bg-[#0A1628]/5 ${index === 0 ? "h-72 md:h-80" : "h-60"}`}>
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0A1628]/8">
                        <span className="text-[#0A1628]/20 text-5xl font-playfair">L</span>
                      </div>
                    )}

                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 via-transparent to-transparent" />

                    {/* Status badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#0A1628] text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                      {statusLabel}
                    </div>

                    {/* Price overlay at bottom */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <div className="text-[#C5A55A] font-bold text-xl leading-none mb-0.5">
                          {formatPrice(listing.price)}
                          {isRent && <span className="text-sm font-normal text-white/70">/mo</span>}
                        </div>
                        <div className="flex items-center gap-1 text-white/75 text-xs">
                          <MapPin className="w-3 h-3" />
                          {listing.city}, {listing.state}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property details */}
                  <div className="px-5 py-4">
                    <h3 className="font-playfair font-bold text-[#0A1628] text-lg leading-snug group-hover:text-[#C5A55A] transition-colors duration-200 mb-3">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-5 text-[#6B7280] text-sm border-t border-[#E8E4DE] pt-3">
                      {listing.bedrooms > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5" />
                          {listing.bedrooms} Beds
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5" />
                        {listing.bathrooms} Baths
                      </span>
                      {listing.sqft && (
                        <span className="flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5" />
                          {listing.sqft.toLocaleString()} sqft
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Footer link */}
        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 border border-[#0A1628]/20 text-[#0A1628] font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-[#0A1628] hover:text-white hover:border-[#0A1628] transition-all duration-200"
          >
            Browse All Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
