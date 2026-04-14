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
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=85",
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
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=85",
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
    href: "/properties",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=85",
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
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=85",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">Our Services</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6">
            Everything You Need{" "}
            <span className="text-[#C5A55A]">In One Place</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            From buying and selling to renting and financing — Leo Realty provides
            comprehensive real estate services to meet every client need.
          </p>
        </div>
      </section>

      {/* Services — editorial alternating layout */}
      <section className="bg-[#FAF8F5]">
        {services.map((service, i) => (
          <div
            key={service.id}
            id={service.id}
            className={`grid grid-cols-1 lg:grid-cols-2 ${i % 2 === 1 ? "" : ""}`}
          >
            {/* Image half */}
            <div className={`relative h-72 lg:h-auto min-h-96 overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0A1628]/30" />
              {/* Icon overlay */}
              <div className="absolute bottom-6 left-6 w-14 h-14 rounded-2xl bg-[#C5A55A] flex items-center justify-center">
                <service.icon className="w-7 h-7 text-[#0A1628]" />
              </div>
            </div>

            {/* Content half */}
            <div className={`flex flex-col justify-center p-10 lg:p-16 bg-white ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <span className="section-label">{service.tagline}</span>
              <h2 className="font-playfair text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#0A1628] mb-4 leading-tight">
                {service.title}
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-7 text-[15px]">{service.description}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[#6B7280] text-sm">
                    <CheckCircle className="w-4 h-4 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="group inline-flex items-center gap-2 bg-[#0A1628] text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-[#152238] transition-colors self-start"
              >
                {service.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Why Leo Realty */}
      <section className="py-24 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-label justify-center">Why Leo Realty</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-white">
              A Track Record That Speaks for Itself
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { stat: "MR 2%", label: "Commission Model", detail: "More money stays in your pocket" },
              { stat: "32+", label: "Years Experience", detail: "Decades of proven expertise" },
              { stat: "1,000+", label: "Transactions", detail: "Successful closings" },
              { stat: "6", label: "Team Members", detail: "Dedicated licensed professionals" },
            ].map((item) => (
              <div key={item.label} className="bg-white/4 border border-white/6 rounded-2xl p-7 text-center hover:border-[#C5A55A]/25 transition-colors">
                <div className="font-playfair text-4xl font-bold text-[#C5A55A] mb-2">{item.stat}</div>
                <div className="text-white font-semibold text-sm mb-2">{item.label}</div>
                <div className="text-white/40 text-xs">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-[#0A1628]/65 mb-8">
            Contact Leo Realty today for a free consultation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold text-sm px-9 py-4 rounded-full hover:bg-[#152238] transition-colors shadow-xl shadow-[#0A1628]/20"
          >
            Free Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
