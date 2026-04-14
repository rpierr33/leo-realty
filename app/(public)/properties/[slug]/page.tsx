import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bed, Bath, Ruler, MapPin, Phone, Mail, Calendar, ArrowLeft, CheckCircle } from "lucide-react";
import { db } from "@/lib/db";
import { properties, agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/utils/format";
import ContactAgentForm from "@/components/properties/ContactAgentForm";

type Props = {
  params: Promise<{ slug: string }>;
};

// Fallback property data — used when DB is not connected
const FALLBACK_PROPERTIES: Record<string, {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  status: "for_sale" | "for_rent" | "pending" | "sold" | "rented";
  propertyType: "residential" | "condo" | "townhouse" | "commercial" | "multi_family" | "land" | "investment";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  images: { url: string; caption: string; order: number }[];
  features: string[];
  isFeatured: boolean;
  yearBuilt: number | null;
  parking: number;
  lotSize: string | null;
  mlsId: string | null;
  agentId: number | null;
  isPublished: boolean;
}> = {
  "luxury-waterfront-miami": {
    id: 1,
    slug: "luxury-waterfront-miami",
    title: "Luxury Waterfront Estate",
    description: "A breathtaking waterfront estate in the heart of Miami Beach. This stunning 5-bedroom, 4-bathroom residence features panoramic ocean views, a private pool, and world-class finishes throughout. Perfect for the discerning buyer seeking the pinnacle of South Florida luxury living.",
    price: "1250000",
    status: "for_sale",
    propertyType: "residential",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3800,
    address: "123 Ocean Drive",
    city: "Miami Beach",
    state: "FL",
    zip: "33139",
    images: [
      { url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80", caption: "Front Exterior", order: 0 },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80", caption: "Living Room", order: 1 },
      { url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", caption: "Pool Area", order: 2 },
    ],
    features: ["Private Pool", "Ocean Views", "Smart Home", "Chef's Kitchen", "Wine Cellar", "2-Car Garage", "Private Dock", "Summer Kitchen"],
    isFeatured: true,
    yearBuilt: 2018,
    parking: 2,
    lotSize: "0.35 acres",
    mlsId: "LR-001",
    agentId: 1,
    isPublished: true,
  },
  "modern-condo-brickell": {
    id: 2,
    slug: "modern-condo-brickell",
    title: "Modern Brickell Condo",
    description: "Stunning contemporary condo in Brickell's most sought-after high-rise. Floor-to-ceiling windows, designer finishes, and resort-style amenities. Walking distance to top restaurants, shopping, and Brickell City Centre.",
    price: "485000",
    status: "for_sale",
    propertyType: "condo",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    address: "456 Brickell Ave",
    city: "Miami",
    state: "FL",
    zip: "33131",
    images: [
      { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80", caption: "Living Area", order: 0 },
    ],
    features: ["City Views", "Pool & Gym", "Valet Parking", "Concierge", "Floor-to-Ceiling Windows", "Stainless Appliances"],
    isFeatured: true,
    yearBuilt: 2020,
    parking: 1,
    lotSize: null,
    mlsId: "LR-002",
    agentId: 6,
    isPublished: true,
  },
  "family-home-aventura": {
    id: 3,
    slug: "family-home-aventura",
    title: "Spacious Family Home",
    description: "A beautiful 4-bedroom family home in one of Aventura's most desirable neighborhoods. Spacious open floor plan, updated kitchen, large backyard, and top-rated schools nearby. Move-in ready and priced to sell.",
    price: "680000",
    status: "for_sale",
    propertyType: "residential",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2600,
    address: "789 Aventura Blvd",
    city: "Aventura",
    state: "FL",
    zip: "33180",
    images: [
      { url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80", caption: "Front Exterior", order: 0 },
    ],
    features: ["Large Backyard", "Updated Kitchen", "2-Car Garage", "Impact Windows", "Top-Rated Schools", "Community Pool"],
    isFeatured: true,
    yearBuilt: 2005,
    parking: 2,
    lotSize: "0.22 acres",
    mlsId: "LR-003",
    agentId: 3,
    isPublished: true,
  },
  "investment-property-hialeah": {
    id: 4,
    slug: "investment-property-hialeah",
    title: "Investment Multi-Family",
    description: "Prime investment opportunity in Hialeah. This 6-unit multi-family property generates strong rental income with room to increase rents to market rate. Fully occupied with long-term tenants. Excellent cap rate.",
    price: "890000",
    status: "for_sale",
    propertyType: "multi_family",
    bedrooms: 6,
    bathrooms: 6,
    sqft: 4200,
    address: "321 Palm Ave",
    city: "Hialeah",
    state: "FL",
    zip: "33010",
    images: [
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80", caption: "Property Exterior", order: 0 },
    ],
    features: ["6 Units", "Fully Occupied", "Strong Cap Rate", "Below Market Rents", "Recent Roof", "Separate Meters"],
    isFeatured: false,
    yearBuilt: 1998,
    parking: 6,
    lotSize: "0.18 acres",
    mlsId: "LR-004",
    agentId: 4,
    isPublished: true,
  },
  "cozy-townhouse-doral": {
    id: 5,
    slug: "cozy-townhouse-doral",
    title: "Cozy Doral Townhouse",
    description: "Charming 3-bedroom townhouse in a gated Doral community. Updated throughout with modern finishes, private patio, and 1-car garage. Community pool and fitness center included. Available immediately.",
    price: "3200",
    status: "for_rent",
    propertyType: "townhouse",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    address: "555 Doral Blvd",
    city: "Doral",
    state: "FL",
    zip: "33166",
    images: [
      { url: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1200&q=80", caption: "Townhouse Exterior", order: 0 },
    ],
    features: ["Gated Community", "Community Pool", "Fitness Center", "Private Patio", "1-Car Garage", "In-Unit Laundry"],
    isFeatured: false,
    yearBuilt: 2012,
    parking: 1,
    lotSize: null,
    mlsId: "LR-005",
    agentId: 6,
    isPublished: true,
  },
  "commercial-space-nmi": {
    id: 6,
    slug: "commercial-space-nmi",
    title: "Prime Commercial Space",
    description: "Professional office suite in North Miami Beach's premier business district. Suite 301A features 2,400 sq ft of open floor plan with private offices, conference room, and reception area. Building amenities include on-site parking, 24/7 access, and modern lobby.",
    price: "5500",
    status: "for_rent",
    propertyType: "commercial",
    bedrooms: 0,
    bathrooms: 2,
    sqft: 2400,
    address: "909 North Miami Beach Blvd Suite 301A",
    city: "North Miami Beach",
    state: "FL",
    zip: "33162",
    images: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80", caption: "Office Interior", order: 0 },
    ],
    features: ["Open Floor Plan", "Private Offices", "Conference Room", "On-Site Parking", "24/7 Access", "High-Speed Internet"],
    isFeatured: false,
    yearBuilt: 2000,
    parking: 10,
    lotSize: null,
    mlsId: "LR-006",
    agentId: 1,
    isPublished: true,
  },
};

const FALLBACK_AGENTS: Record<number, { name: string; title: string; phone: string; email: string; avatarUrl: string | null }> = {
  1: { name: "Leopold Evariste", title: "CEO & Founder", phone: "(305) 705-2030", email: "leopold@leorealty.com", avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  3: { name: "Jean Samuel Luxama", title: "Realtor & Loan Originator", phone: "(305) 705-2030", email: "jsluxama@leorealty.com", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
  4: { name: "Olivier Desire", title: "Loan Originator", phone: "(305) 705-2030", email: "olivier@leorealty.com", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  6: { name: "Carly Cadet", title: "Realtor Associate", phone: "(305) 705-2030", email: "carly@leorealty.com", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug))
      .limit(1);
    if (!property) {
      const fallback = FALLBACK_PROPERTIES[slug];
      if (!fallback) return { title: "Property Not Found" };
      return {
        title: `${fallback.title} — ${formatPrice(fallback.price)}`,
        description: fallback.description.slice(0, 160),
      };
    }
    return {
      title: `${property.title} — ${formatPrice(property.price)}`,
      description: property.description.slice(0, 160),
    };
  } catch {
    const fallback = FALLBACK_PROPERTIES[slug];
    if (fallback) {
      return {
        title: `${fallback.title} — ${formatPrice(fallback.price)}`,
        description: fallback.description.slice(0, 160),
      };
    }
    return { title: "Property" };
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  let property = null;
  let agent = null;

  try {
    const [row] = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug))
      .limit(1);
    property = row;

    if (property?.agentId) {
      const [agentRow] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, property.agentId))
        .limit(1);
      agent = agentRow;
    }
  } catch {
    console.error("DB not connected, using fallback for property:", slug);
  }

  // If DB returned nothing, try fallback data
  const fallbackProperty = FALLBACK_PROPERTIES[slug];
  if (!property && !fallbackProperty) notFound();

  const displayProperty = property ?? fallbackProperty!;

  // Resolve agent — use fallback if DB agent not loaded
  const displayAgent = agent ?? (
    displayProperty.agentId != null
      ? FALLBACK_AGENTS[displayProperty.agentId] ?? null
      : null
  );

  const images = displayProperty.images ?? [];
  const primaryImage = images[0]?.url ?? "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80";
  const features = displayProperty.features ?? [];
  const isRent = displayProperty.status === "for_rent";

  return (
    <>
      <div className="pt-24 bg-[#F8F7F4] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back */}
          <Link href="/properties" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A55A] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                <div className="h-80 md:h-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={primaryImage} alt={displayProperty.title} className="w-full h-full object-cover" />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-1 p-1">
                    {images.slice(1, 5).map((img, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={img.url} alt={img.caption || displayProperty.title} className="h-20 w-full object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    {displayProperty.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span className="bg-[#0A1628]/10 text-[#0A1628] text-xs font-bold px-3 py-1 rounded-full">
                    {displayProperty.propertyType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  {displayProperty.isFeatured && (
                    <span className="bg-[#C5A55A]/20 text-[#C5A55A] text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">
                  {displayProperty.title}
                </h1>
                <p className="text-[#C5A55A] font-bold text-3xl mb-4">
                  {formatPrice(displayProperty.price)}
                  {isRent && <span className="text-base font-normal text-gray-400">/month</span>}
                </p>
                <div className="flex items-center gap-2 text-gray-500 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{displayProperty.address}, {displayProperty.city}, {displayProperty.state} {displayProperty.zip}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-[#F8F7F4] rounded-xl">
                  {displayProperty.bedrooms > 0 && (
                    <div className="text-center">
                      <Bed className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                      <div className="text-[#0A1628] font-bold">{displayProperty.bedrooms}</div>
                      <div className="text-gray-400 text-xs">Bedrooms</div>
                    </div>
                  )}
                  <div className="text-center">
                    <Bath className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                    <div className="text-[#0A1628] font-bold">{displayProperty.bathrooms}</div>
                    <div className="text-gray-400 text-xs">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Ruler className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                    <div className="text-[#0A1628] font-bold">{displayProperty.sqft?.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">Sq Ft</div>
                  </div>
                  {displayProperty.yearBuilt && (
                    <div className="text-center">
                      <Calendar className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                      <div className="text-[#0A1628] font-bold">{displayProperty.yearBuilt}</div>
                      <div className="text-gray-400 text-xs">Year Built</div>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{displayProperty.description}</p>

                {features.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">Features & Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                          <CheckCircle className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent card */}
              {displayAgent && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">Listed By</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0A1628]/10">
                      {displayAgent.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={displayAgent.avatarUrl} alt={displayAgent.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0A1628]">
                          <span className="text-white font-bold">{displayAgent.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-[#0A1628]">{displayAgent.name}</div>
                      <div className="text-[#C5A55A] text-sm">{displayAgent.title}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a href={`tel:${displayAgent.phone}`} className="flex items-center gap-2 text-gray-600 text-sm hover:text-[#C5A55A] transition-colors">
                      <Phone className="w-4 h-4" /> {displayAgent.phone}
                    </a>
                    <a href={`mailto:${displayAgent.email}`} className="flex items-center gap-2 text-gray-600 text-sm hover:text-[#C5A55A] transition-colors">
                      <Mail className="w-4 h-4" /> {displayAgent.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Contact form */}
              <ContactAgentForm propertyTitle={displayProperty.title} propertyId={displayProperty.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
