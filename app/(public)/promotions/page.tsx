import { Metadata } from "next";
import Link from "next/link";
import { Tag, Clock, ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Leo Promotions — Current Deals & Special Programs",
  description:
    "Check out Leo Realty's current promotions, special mortgage programs, and seasonal offers for buyers, sellers, and investors.",
};

const promotions = [
  {
    id: 1,
    title: "MR 2% Commission — Always",
    badge: "Ongoing",
    badgeColor: "bg-green-100 text-green-700",
    description:
      "Leo Realty's signature offer: sell your home with just 2% total commission. Keep more of your equity while receiving full-service representation. No catch, no fine print.",
    highlight: "Save thousands on every transaction",
    details: ["Full MLS listing", "Professional photography", "Open houses", "Negotiation support", "Closing coordination"],
    cta: "List With Us",
    href: "/contact",
    featured: true,
  },
  {
    id: 2,
    title: "Hometown Heroes Spring Program",
    badge: "Limited Time",
    badgeColor: "bg-orange-100 text-orange-700",
    description:
      "Frontline workers — teachers, nurses, law enforcement, firefighters — can qualify for up to $35,000 in down payment and closing cost assistance through the Florida Hometown Heroes program.",
    highlight: "Up to $35,000 in assistance",
    details: ["Zero down payment options", "Below-market interest rates", "Fast pre-approval", "Expert guidance", "Available statewide"],
    cta: "Check Eligibility",
    href: "/loan-programs#hometown-heroes",
    featured: false,
  },
  {
    id: 3,
    title: "Free Home Valuation",
    badge: "Always Free",
    badgeColor: "bg-blue-100 text-blue-700",
    description:
      "Thinking of selling? Get a comprehensive, no-obligation Comparative Market Analysis (CMA) from Leo Realty's experienced agents. Know your home's true market value.",
    highlight: "No obligation, 100% free",
    details: ["Detailed market analysis", "Comparable sales review", "Price optimization", "Timing recommendations", "Written report"],
    cta: "Get Your CMA",
    href: "/contact",
    featured: false,
  },
  {
    id: 4,
    title: "First-Time Buyer Package",
    badge: "Year-Round",
    badgeColor: "bg-purple-100 text-purple-700",
    description:
      "Leo Realty's comprehensive first-time buyer package includes buyer education, mortgage pre-approval, property search, and hand-holding through closing — all in one seamless service.",
    highlight: "End-to-end first-time buyer support",
    details: ["Buyer consultation", "Mortgage pre-approval", "FHA/USDA/Conventional options", "Inspection guidance", "Post-closing support"],
    cta: "Start Your Journey",
    href: "/contact",
    featured: false,
  },
  {
    id: 5,
    title: "Investor Consultation",
    badge: "Free",
    badgeColor: "bg-yellow-100 text-yellow-700",
    description:
      "Free investment property consultation with Leo Realty's investment specialists. Analysis of ROI, cap rates, financing options, and market opportunities across South Florida.",
    highlight: "Free 60-minute strategy session",
    details: ["ROI analysis", "DSCR loan options", "Market opportunity review", "Portfolio strategy", "Property sourcing"],
    cta: "Book Consultation",
    href: "/contact",
    featured: false,
  },
];

export default function PromotionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-[#C5A55A]" />
            <span className="text-[#C5A55A] text-sm font-medium">Leo Promotions</span>
          </div>
          <h1 className="text-5xl font-bold text-white font-[var(--font-playfair)] mb-4">
            Current Offers &{" "}
            <span className="text-[#C5A55A]">Special Programs</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            Leo Realty is committed to delivering maximum value. Take advantage
            of our current promotions and special programs.
          </p>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`rounded-3xl p-8 border ${
                  promo.featured
                    ? "bg-[#0A1628] border-[#C5A55A]/30 lg:col-span-2"
                    : "bg-white border-gray-100 hover:shadow-lg transition-shadow"
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Tag className={`w-5 h-5 ${promo.featured ? "text-[#C5A55A]" : "text-[#C5A55A]"}`} />
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${promo.badgeColor}`}>
                      {promo.badge}
                    </span>
                  </div>
                  {promo.featured && (
                    <div className="flex items-center gap-1 text-[#C5A55A] text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Our Signature Offer
                    </div>
                  )}
                </div>

                <h2 className={`text-2xl font-bold font-[var(--font-playfair)] mb-3 ${
                  promo.featured ? "text-white" : "text-[#0A1628]"
                }`}>
                  {promo.title}
                </h2>

                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 ${
                  promo.featured ? "bg-[#C5A55A]/20 text-[#C5A55A]" : "bg-[#0A1628]/5 text-[#0A1628]"
                }`}>
                  <Star className="w-3.5 h-3.5" />
                  <span className="text-sm font-semibold">{promo.highlight}</span>
                </div>

                <p className={`leading-relaxed mb-6 ${promo.featured ? "text-white/70" : "text-gray-600"}`}>
                  {promo.description}
                </p>

                {promo.featured ? (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {promo.details.map((d) => (
                      <div key={d} className="bg-white/10 text-white/80 text-xs text-center px-3 py-2 rounded-lg">
                        {d}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="grid grid-cols-2 gap-2 mb-6">
                    {promo.details.map((d) => (
                      <li key={d} className="text-gray-500 text-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A55A]" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={promo.href}
                  className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-colors ${
                    promo.featured
                      ? "bg-[#C5A55A] text-[#0A1628] hover:bg-[#D4B96A]"
                      : "bg-[#0A1628] text-white hover:bg-[#162447]"
                  }`}
                >
                  {promo.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">
            Questions About Our Programs?
          </h2>
          <p className="text-[#0A1628]/70 mb-8">
            Our team is ready to explain every option and help you find the best fit.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold px-8 py-4 rounded-full hover:bg-[#162447] transition-colors"
          >
            Contact Us Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
