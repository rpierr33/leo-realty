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
    images: [{ url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80", caption: "", order: 0 }],
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
    images: [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", caption: "", order: 0 }],
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
    images: [{ url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", caption: "", order: 0 }],
    isFeatured: true,
    agentName: "Jean Samuel Luxama",
  },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  for_sale: { label: "For Sale", color: "bg-green-500" },
  for_rent: { label: "For Rent", color: "bg-blue-500" },
  pending: { label: "Pending", color: "bg-yellow-500" },
  sold: { label: "Sold", color: "bg-gray-500" },
  rented: { label: "Rented", color: "bg-gray-500" },
};

export default async function FeaturedListings() {
  const listings = await getFeaturedProperties();
  const displayListings = listings.length > 0 ? listings : FALLBACK_LISTINGS;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">
                Featured Listings
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628] font-[var(--font-playfair)]">
              Premium Properties
            </h2>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-[#C5A55A] font-semibold hover:gap-3 transition-all"
          >
            View All Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {displayListings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No featured properties at this time.</p>
            <Link href="/contact" className="text-[#C5A55A] underline mt-2 block">
              Contact us to find your perfect home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayListings.map((listing) => {
              const image = listing.images?.[0]?.url;
              const status = STATUS_LABELS[listing.status] ?? { label: listing.status, color: "bg-gray-500" };

              return (
                <Link
                  key={listing.id}
                  href={`/properties/${listing.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl hover:shadow-[#0A1628]/5 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0A1628]/5">
                        <span className="text-gray-300 text-4xl">🏠</span>
                      </div>
                    )}
                    <div className={`absolute top-4 left-4 ${status.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {status.label}
                    </div>
                    {listing.isFeatured && (
                      <div className="absolute top-4 right-4 bg-[#C5A55A] text-[#0A1628] text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <p className="text-[#C5A55A] font-bold text-xl mb-1">
                      {formatPrice(listing.price)}
                    </p>
                    <h3 className="font-bold text-[#0A1628] text-lg font-[var(--font-playfair)] mb-2 group-hover:text-[#C5A55A] transition-colors">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{listing.city}, {listing.state}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 text-sm pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {listing.bedrooms} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {listing.bathrooms} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        {listing.sqft?.toLocaleString()} sqft
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
