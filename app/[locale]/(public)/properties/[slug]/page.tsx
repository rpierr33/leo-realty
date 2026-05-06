import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bed, Bath, Ruler, MapPin, Phone, Mail, Calendar, ArrowLeft } from "lucide-react";
import ContactAgentForm from "@/components/properties/ContactAgentForm";
import { getProperty, formatPriceUSD, type MlsListing } from "@/lib/mls";

type Props = {
  params: Promise<{ slug: string }>;
};

const STATUS_LABEL: Record<string, string> = {
  Active: "Active",
  ActiveUnderContract: "Under Contract",
  Pending: "Pending",
  Closed: "Sold",
  Hold: "On Hold",
  Withdrawn: "Withdrawn",
  Expired: "Expired",
  Canceled: "Canceled",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listingKey = decodeURIComponent(slug);
  try {
    const listing = await getProperty(listingKey);
    if (!listing) return { title: "Property Not Found" };
    const title = listing.unparsedAddress ?? "Property";
    const price = formatPriceUSD(listing.listPrice);
    return {
      title: `${title} — ${price}`,
      description: (listing.publicRemarks ?? "").slice(0, 160),
    };
  } catch {
    return { title: "Property" };
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const listingKey = decodeURIComponent(slug);

  let listing: MlsListing | null = null;
  let mlsError: string | null = null;

  try {
    listing = await getProperty(listingKey);
  } catch (err) {
    mlsError = err instanceof Error ? err.message : "MLS lookup failed";
    console.error("Property detail MLS error:", mlsError);
  }

  if (!listing) {
    if (mlsError) {
      return (
        <div className="pt-24 bg-[#F8F7F4] min-h-screen">
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <h1 className="font-playfair text-2xl font-bold text-[#0A1628] mb-3">Listing temporarily unavailable</h1>
            <p className="text-gray-600 mb-6">We couldn&apos;t load this listing right now. Please try again in a moment.</p>
            <Link href="/properties" className="text-[#C5A55A] font-semibold underline underline-offset-4">
              Back to Properties
            </Link>
          </div>
        </div>
      );
    }
    notFound();
  }

  const title =
    listing.unparsedAddress ??
    [listing.city, listing.stateOrProvince].filter(Boolean).join(", ") ??
    "Listing";

  const images = listing.photos;
  const primaryImage = images[0]?.url;
  const statusLabel = STATUS_LABEL[listing.status ?? ""] ?? listing.status ?? "Active";
  const locationLine = [listing.city, listing.stateOrProvince, listing.postalCode].filter(Boolean).join(", ");

  return (
    <div className="pt-24 bg-[#F8F7F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A55A] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
              <div className="h-80 md:h-96 bg-[#0A1628]/5">
                {primaryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={primaryImage} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-playfair text-[#0A1628]/20 text-6xl">L</span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-1 p-1">
                  {images.slice(1, 5).map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img.url} alt={img.description ?? title} className="h-20 w-full object-cover rounded" />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  {statusLabel}
                </span>
                {listing.propertySubType && (
                  <span className="bg-[#0A1628]/10 text-[#0A1628] text-xs font-bold px-3 py-1 rounded-full">
                    {listing.propertySubType}
                  </span>
                )}
                {listing.listingId && (
                  <span className="bg-[#C5A55A]/10 text-[#C5A55A] text-xs font-bold px-3 py-1 rounded-full">
                    MLS #{listing.listingId}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">
                {title}
              </h1>
              <p className="text-[#C5A55A] font-bold text-3xl mb-4">
                {formatPriceUSD(listing.listPrice)}
              </p>
              <div className="flex items-center gap-2 text-gray-500 mb-6">
                <MapPin className="w-4 h-4" />
                <span>{locationLine || "Address available on request"}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-[#F8F7F4] rounded-xl">
                {listing.bedrooms !== null && listing.bedrooms > 0 && (
                  <div className="text-center">
                    <Bed className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                    <div className="text-[#0A1628] font-bold">{listing.bedrooms}</div>
                    <div className="text-gray-400 text-xs">Bedrooms</div>
                  </div>
                )}
                {listing.bathroomsTotal !== null && listing.bathroomsTotal > 0 && (
                  <div className="text-center">
                    <Bath className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                    <div className="text-[#0A1628] font-bold">{listing.bathroomsTotal}</div>
                    <div className="text-gray-400 text-xs">Bathrooms</div>
                  </div>
                )}
                {listing.livingArea !== null && listing.livingArea > 0 && (
                  <div className="text-center">
                    <Ruler className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                    <div className="text-[#0A1628] font-bold">{listing.livingArea.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">Sq Ft</div>
                  </div>
                )}
                {listing.yearBuilt && (
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-[#C5A55A] mx-auto mb-1" />
                    <div className="text-[#0A1628] font-bold">{listing.yearBuilt}</div>
                    <div className="text-gray-400 text-xs">Year Built</div>
                  </div>
                )}
              </div>

              {listing.publicRemarks && (
                <>
                  <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">Description</h2>
                  <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">{listing.publicRemarks}</p>
                </>
              )}

              {(listing.listingAgentName || listing.listingOfficeName) && (
                <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
                  Listing courtesy of{" "}
                  {[listing.listingAgentName, listing.listingOfficeName].filter(Boolean).join(", ")}
                  {listing.modifiedAt && <> · Updated {new Date(listing.modifiedAt).toLocaleDateString()}</>}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-2">Interested in this property?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Speak with a Leo Realty agent today — we&apos;ll arrange a showing and answer questions.
              </p>
              <div className="space-y-2">
                <a href="tel:+13057052030" className="flex items-center gap-2 text-gray-600 text-sm hover:text-[#C5A55A] transition-colors">
                  <Phone className="w-4 h-4" /> (305) 705-2030
                </a>
                <a href="mailto:Info@leorealtycapitalinvestments.com" className="flex items-center gap-2 text-gray-600 text-sm hover:text-[#C5A55A] transition-colors">
                  <Mail className="w-4 h-4" /> Info@leorealtycapitalinvestments.com
                </a>
              </div>
            </div>

            <ContactAgentForm propertyTitle={title} propertyId={0} />
          </div>
        </div>
      </div>
    </div>
  );
}
