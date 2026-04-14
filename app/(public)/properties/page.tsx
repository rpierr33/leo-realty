import { Metadata } from "next";
import Link from "next/link";
import { Bed, Bath, Ruler, MapPin, Search } from "lucide-react";
import { db } from "@/lib/db";
import { properties, agents } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Properties — Buy, Sell & Rent in South Florida",
  description:
    "Browse Leo Realty's property listings. Find homes for sale, rent, and investment properties throughout South Florida.",
};

export const revalidate = 60;

async function getAllProperties() {
  try {
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
      .where(eq(properties.isPublished, true))
      .orderBy(properties.createdAt);
  } catch {
    return [];
  }
}

const FALLBACK_PROPERTIES = [
  { id: 1, slug: "luxury-waterfront-miami", title: "Luxury Waterfront Estate", price: "1250000", status: "for_sale" as const, propertyType: "residential" as const, bedrooms: 5, bathrooms: 4, sqft: 3800, address: "123 Ocean Drive", city: "Miami Beach", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80", caption: "", order: 0 }], isFeatured: true, agentName: "Leopold Evariste" },
  { id: 2, slug: "modern-condo-brickell", title: "Modern Brickell Condo", price: "485000", status: "for_sale" as const, propertyType: "condo" as const, bedrooms: 2, bathrooms: 2, sqft: 1200, address: "456 Brickell Ave", city: "Miami", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", caption: "", order: 0 }], isFeatured: true, agentName: "Carly Cadet" },
  { id: 3, slug: "family-home-aventura", title: "Spacious Family Home", price: "680000", status: "for_sale" as const, propertyType: "residential" as const, bedrooms: 4, bathrooms: 3, sqft: 2600, address: "789 Aventura Blvd", city: "Aventura", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", caption: "", order: 0 }], isFeatured: true, agentName: "Jean Samuel Luxama" },
  { id: 4, slug: "investment-property-hialeah", title: "Investment Multi-Family", price: "890000", status: "for_sale" as const, propertyType: "multi_family" as const, bedrooms: 6, bathrooms: 6, sqft: 4200, address: "321 Palm Ave", city: "Hialeah", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80", caption: "", order: 0 }], isFeatured: false, agentName: "Olivier Desire" },
  { id: 5, slug: "cozy-townhouse-doral", title: "Cozy Doral Townhouse", price: "3200", status: "for_rent" as const, propertyType: "townhouse" as const, bedrooms: 3, bathrooms: 2, sqft: 1800, address: "555 Doral Blvd", city: "Doral", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&q=80", caption: "", order: 0 }], isFeatured: false, agentName: "Carly Cadet" },
  { id: 6, slug: "commercial-space-nmi", title: "Prime Commercial Space", price: "5500", status: "for_rent" as const, propertyType: "commercial" as const, bedrooms: 0, bathrooms: 2, sqft: 2400, address: "100 NMB Blvd", city: "North Miami Beach", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", caption: "", order: 0 }], isFeatured: false, agentName: "Leopold Evariste" },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string }> = {
  for_sale: { label: "For Sale", bg: "bg-green-100 text-green-700", dot: "bg-green-500" },
  for_rent: { label: "For Rent", bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  pending: { label: "Pending", bg: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  sold: { label: "Sold", bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  rented: { label: "Rented", bg: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

export default async function PropertiesPage() {
  const allProps = await getAllProperties();
  const listings = allProps.length > 0 ? allProps : FALLBACK_PROPERTIES;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-4">
            <span className="text-[#C5A55A] text-sm font-medium">Properties</span>
          </div>
          <h1 className="text-5xl font-bold text-white font-[var(--font-playfair)] mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Browse our curated selection of residential, commercial, and investment
            properties throughout South Florida.
          </p>
        </div>
      </section>

      {/* Search/Filter bar */}
      <section className="bg-white border-b border-gray-100 py-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by city, address..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C5A55A]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "For Sale", "For Rent"].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "All"
                      ? "bg-[#0A1628] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <span className="text-gray-400 text-sm">{listings.length} properties found</span>
          </div>
        </div>
      </section>

      {/* Listings grid */}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          {listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No properties found.</p>
              <Link href="/contact" className="text-[#C5A55A] underline">
                Contact us to find your perfect property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {listings.map((listing) => {
                const image = listing.images?.[0]?.url;
                const status = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.for_sale;
                const isRent = listing.status === "for_rent";

                return (
                  <Link
                    key={listing.id}
                    href={`/properties/${listing.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
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
                      <div className={`absolute top-4 left-4 ${status.bg} text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </div>
                      {listing.isFeatured && (
                        <div className="absolute top-4 right-4 bg-[#C5A55A] text-[#0A1628] text-xs font-bold px-3 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-[#C5A55A] font-bold text-xl mb-1">
                        {formatPrice(listing.price)}
                        {isRent && <span className="text-sm font-normal text-gray-400">/mo</span>}
                      </p>
                      <h3 className="font-bold text-[#0A1628] text-lg font-[var(--font-playfair)] mb-2 group-hover:text-[#C5A55A] transition-colors line-clamp-1">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{listing.address}, {listing.city}, {listing.state}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 text-sm pt-4 border-t border-gray-100">
                        {listing.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" /> {listing.bedrooms}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" /> {listing.bathrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Ruler className="w-4 h-4" /> {listing.sqft?.toLocaleString()} sqft
                        </span>
                        {listing.agentName && (
                          <span className="ml-auto text-xs text-gray-400">{listing.agentName}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white font-[var(--font-playfair)] mb-4">
            Don&apos;t See What You&apos;re Looking For?
          </h2>
          <p className="text-white/60 mb-8">
            Our agents have access to properties not yet listed online. Let us find your perfect match.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold px-8 py-4 rounded-full hover:bg-[#D4B96A] transition-colors"
          >
            Contact An Agent
          </Link>
        </div>
      </section>
    </>
  );
}
