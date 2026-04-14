import { Metadata } from "next";
import Link from "next/link";
import { Home, DollarSign, Key, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Services — Buy, Sell, Rent & Mortgage",
  description:
    "Leo Realty offers comprehensive real estate services: buying, selling, renting, and mortgage lending throughout South Florida.",
};

const services = [
  {
    id: "buying",
    icon: Home,
    title: "Buying a Home",
    tagline: "Find Your Perfect Place",
    description:
      "Whether you're a first-time buyer or an experienced investor, Leo Realty's agents guide you through every step of the buying process — from pre-approval to closing.",
    features: [
      "Free buyer consultation",
      "MLS access to thousands of listings",
      "Expert negotiation on your behalf",
      "Coordination with mortgage team",
      "Inspection and closing support",
      "Post-closing follow-up",
    ],
    cta: "Start Your Home Search",
    href: "/properties",
    color: "from-[#0A1628] to-[#162447]",
  },
  {
    id: "selling",
    icon: DollarSign,
    title: "Selling Your Home",
    tagline: "Maximize Your Sale Price",
    description:
      "Sell faster and for more with Leo Realty's proven MR 2% commission model. Our full-service listing approach gets your property maximum exposure.",
    features: [
      "Free comparative market analysis",
      "Professional photography",
      "MLS & digital marketing",
      "Open house coordination",
      "Expert price negotiation",
      "Streamlined closing process",
    ],
    cta: "Get A Free Valuation",
    href: "/contact",
    color: "from-[#C5A55A] to-[#D4B96A]",
    dark: false,
  },
  {
    id: "renting",
    icon: Key,
    title: "Renting a Property",
    tagline: "Find Your Ideal Rental",
    description:
      "Looking for the perfect rental? Leo Realty has an extensive portfolio of residential, commercial, and multi-family rentals throughout South Florida.",
    features: [
      "Residential apartments & homes",
      "Commercial spaces",
      "Short-term & long-term options",
      "Pet-friendly properties available",
      "Lease negotiation support",
      "Application processing assistance",
    ],
    cta: "Browse Rentals",
    href: "/properties?status=for_rent",
    color: "from-[#0A1628] to-[#162447]",
  },
  {
    id: "mortgage",
    icon: TrendingUp,
    title: "Mortgage Lending",
    tagline: "Mortgages Made Easy",
    description:
      "Leo Realty Capital Investments includes a full-service mortgage team offering FHA, VA, USDA, Conventional, DSCR, and Hometown Heroes programs.",
    features: [
      "FHA, VA, USDA, Conventional loans",
      "DSCR for investment properties",
      "Hometown Heroes program",
      "First-time buyer programs",
      "Fast pre-approval process",
      "Competitive rates & terms",
    ],
    cta: "Explore Loan Programs",
    href: "/loan-programs",
    color: "from-[#C5A55A] to-[#D4B96A]",
    dark: false,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <span className="text-[#C5A55A] text-sm font-medium">Our Services</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-[var(--font-playfair)] mb-6">
            Everything You Need in{" "}
            <span className="text-[#C5A55A]">One Place</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            From buying and selling to renting and financing — Leo Realty provides
            comprehensive real estate services to meet every client need.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {services.map((service, i) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className={`rounded-3xl bg-gradient-to-br ${service.color} p-10 h-80 flex items-center justify-center`}>
                  <service.icon className={`w-24 h-24 ${service.dark === false ? "text-[#0A1628]" : "text-[#C5A55A]"}`} strokeWidth={1} />
                </div>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">
                    {service.tagline}
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">
                  {service.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-gray-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#162447] transition-colors"
                >
                  {service.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Leo Realty */}
      <section className="py-24 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-[var(--font-playfair)] mb-4">
              Why Choose Leo Realty?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Three decades of excellence and a track record that speaks for itself.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: "MR 2%", label: "Commission Model", detail: "More money stays in your pocket" },
              { stat: "32+", label: "Years Experience", detail: "Decades of proven market expertise" },
              { stat: "1,000+", label: "Transactions", detail: "Successful closings across South Florida" },
              { stat: "6", label: "Team Members", detail: "Dedicated licensed professionals" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-[#C5A55A] font-[var(--font-playfair)] mb-2">{item.stat}</div>
                <div className="text-white font-semibold mb-2">{item.label}</div>
                <div className="text-white/50 text-sm">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-[#0A1628]/70 mb-8">
            Contact Leo Realty today for a free consultation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold px-8 py-4 rounded-full hover:bg-[#162447] transition-colors"
          >
            Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
