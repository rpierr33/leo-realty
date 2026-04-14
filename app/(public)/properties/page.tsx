import { Metadata } from "next";
import Link from "next/link";
import { Bed, Bath, Ruler, MapPin, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { properties, agents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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
  { id: 1, slug: "luxury-waterfront-miami", title: "Luxury Waterfront Estate", price: "1250000", status: "for_sale" as const, propertyType: "residential" as const, bedrooms: 5, bathrooms: 4, sqft: 3800, address: "123 Ocean Drive", city: "Miami Beach", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=85", caption: "", order: 0 }], isFeatured: true, agentName: "Leopold Evariste" },
  { id: 2, slug: "modern-condo-brickell", title: "Modern Brickell Condo", price: "485000", status: "for_sale" as const, propertyType: "condo" as const, bedrooms: 2, bathrooms: 2, sqft: 1200, address: "456 Brickell Ave", city: "Miami", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=85", caption: "", order: 0 }], isFeatured: true, agentName: "Carly Cadet" },
  { id: 3, slug: "family-home-aventura", title: "Spacious Family Home", price: "680000", status: "for_sale" as const, propertyType: "residential" as const, bedrooms: 4, bathrooms: 3, sqft: 2600, address: "789 Aventura Blvd", city: "Aventura", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=85", caption: "", order: 0 }], isFeatured: true, agentName: "Jean Samuel Luxama" },
  { id: 4, slug: "investment-property-hialeah", title: "Investment Multi-Family", price: "890000", status: "for_sale" as const, propertyType: "multi_family" as const, bedrooms: 6, bathrooms: 6, sqft: 4200, address: "321 Palm Ave", city: "Hialeah", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85", caption: "", order: 0 }], isFeatured: false, agentName: "Olivier Desire" },
  { id: 5, slug: "cozy-townhouse-doral", title: "Cozy Doral Townhouse", price: "3200", status: "for_rent" as const, propertyType: "townhouse" as const, bedrooms: 3, bathrooms: 2, sqft: 1800, address: "555 Doral Blvd", city: "Doral", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=85", caption: "", order: 0 }], isFeatured: false, agentName: "Carly Cadet" },
  { id: 6, slug: "commercial-space-nmi", title: "Prime Commercial Space", price: "5500", status: "for_rent" as const, propertyType: "commercial" as const, bedrooms: 0, bathrooms: 2, sqft: 2400, address: "100 NMB Blvd", city: "North Miami Beach", state: "FL", images: [{ url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=85", caption: "", order: 0 }], isFeatured: false, agentName: "Leopold Evariste" },
];

const STATUS_CONFIG: Record<string, { label: string }> = {
  for_sale: { label: "For Sale" },
  for_rent: { label: "For Rent" },
  pending: { label: "Pending" },
  sold: { label: "Sold" },
  rented: { label: "Rented" },
};

export default async function PropertiesPage() {
  const allProps = await getAllProperties();
  const listings = allProps.length > 0 ? allProps : FALLBACK_PROPERTIES;

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
            {listings.length} Properties Available
          </div>
        </div>
      </section>

      {/* Listings grid */}
      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#6B7280] text-lg mb-4">No properties currently listed.</p>
              <Link href="/contact" className="text-[#C5A55A] font-semibold underline underline-offset-4">
                Contact us to find your perfect property
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

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/50 via-transparent to-transparent" />

                      {/* Status */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#0A1628] text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                        {statusLabel}
                      </div>

                      {listing.isFeatured && (
                        <div className="absolute top-4 right-4 bg-[#C5A55A] text-[#0A1628] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                          Featured
                        </div>
                      )}

                      {/* Price on image */}
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
