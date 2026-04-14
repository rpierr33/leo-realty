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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug))
      .limit(1);
    if (!property) return { title: "Property Not Found" };
    return {
      title: `${property.title} — ${formatPrice(property.price)}`,
      description: property.description.slice(0, 160),
    };
  } catch {
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
    // fallback
  }

  if (!property) notFound();

  const images = property.images ?? [];
  const primaryImage = images[0]?.url ?? "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80";
  const features = property.features ?? [];
  const isRent = property.status === "for_rent";

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
                  <img src={primaryImage} alt={property.title} className="w-full h-full object-cover" />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-1 p-1">
                    {images.slice(1, 5).map((img, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={img.url} alt={img.caption || property.title} className="h-20 w-full object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    {property.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span className="bg-[#0A1628]/10 text-[#0A1628] text-xs font-bold px-3 py-1 rounded-full">
                    {property.propertyType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  {property.isFeatured && (
                    <span className="bg-[#C5A55A]/20 text-[#C5A55A] text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">
                  {property.title}
                </h1>
                <p className="text-[#C5A55A] font-bold text-3xl mb-4">
                  {formatPrice(property.price)}
                  {isRent && <span className="text-base font-normal text-gray-400">/month</span>}
                </p>
                <div className="flex items-center gap-2 text-gray-500 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-[#F8F7F4] rounded-xl">
                  {property.bedrooms > 0 && (
                    <div className="text-center">
                      <Bed className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                      <div className="text-[#0A1628] font-bold">{property.bedrooms}</div>
                      <div className="text-gray-400 text-xs">Bedrooms</div>
                    </div>
                  )}
                  <div className="text-center">
                    <Bath className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                    <div className="text-[#0A1628] font-bold">{property.bathrooms}</div>
                    <div className="text-gray-400 text-xs">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Ruler className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                    <div className="text-[#0A1628] font-bold">{property.sqft?.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">Sq Ft</div>
                  </div>
                  {property.yearBuilt && (
                    <div className="text-center">
                      <Calendar className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                      <div className="text-[#0A1628] font-bold">{property.yearBuilt}</div>
                      <div className="text-gray-400 text-xs">Year Built</div>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{property.description}</p>

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
              {agent && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">Listed By</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0A1628]/10">
                      {agent.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0A1628]">
                          <span className="text-white font-bold">{agent.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-[#0A1628]">{agent.name}</div>
                      <div className="text-[#C5A55A] text-sm">{agent.title}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-gray-600 text-sm hover:text-[#C5A55A] transition-colors">
                      <Phone className="w-4 h-4" /> {agent.phone}
                    </a>
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-gray-600 text-sm hover:text-[#C5A55A] transition-colors">
                      <Mail className="w-4 h-4" /> {agent.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Contact form */}
              <ContactAgentForm propertyTitle={property.title} propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
