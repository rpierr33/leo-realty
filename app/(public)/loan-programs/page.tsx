import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, Star, Shield, Home, DollarSign, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Loan Programs — FHA, VA, USDA, Conventional & More",
  description:
    "Leo Realty offers FHA, VA, USDA, Conventional, DSCR, and Hometown Heroes mortgage programs. Find the right loan for your situation.",
};

const programs = [
  {
    id: "fha",
    icon: Home,
    name: "FHA Loans",
    tagline: "Government-Backed Accessibility",
    description:
      "FHA loans are backed by the Federal Housing Administration and offer flexible qualification requirements. Ideal for buyers with moderate credit scores or limited savings.",
    minDown: "3.5%",
    minCredit: "580+",
    maxLoan: "$498,257",
    features: [
      "Low down payment requirement",
      "Flexible credit score guidelines",
      "Competitive interest rates",
      "Fixed and adjustable rates available",
      "Gift funds allowed for down payment",
      "Primary residence only",
    ],
    badge: null,
    featured: false,
  },
  {
    id: "va",
    icon: Shield,
    name: "VA Loans",
    tagline: "Honoring Our Veterans",
    description:
      "VA loans are exclusively available to veterans, active-duty service members, and eligible surviving spouses — with no down payment and no private mortgage insurance.",
    minDown: "0%",
    minCredit: "620+",
    maxLoan: "No limit",
    features: [
      "Zero down payment required",
      "No private mortgage insurance (PMI)",
      "Competitive interest rates",
      "No prepayment penalties",
      "Flexible refinancing options",
      "Assumable mortgage benefit",
    ],
    badge: "For Veterans",
    featured: false,
  },
  {
    id: "usda",
    icon: Home,
    name: "USDA Loans",
    tagline: "Rural & Suburban Opportunities",
    description:
      "USDA loans provide 100% financing for eligible rural and suburban properties backed by the U.S. Department of Agriculture, offering competitive rates and no down payment.",
    minDown: "0%",
    minCredit: "640+",
    maxLoan: "Area-based",
    features: [
      "100% financing — no down payment",
      "Below-market interest rates",
      "Low mortgage insurance fees",
      "Flexible credit requirements",
      "Can include closing costs in loan",
      "Primary residence only",
    ],
    badge: null,
    featured: false,
  },
  {
    id: "conventional",
    icon: DollarSign,
    name: "Conventional Loans",
    tagline: "Flexible Standard Financing",
    description:
      "Conventional loans offer flexibility for buyers with strong credit. Available for primary residences, second homes, and investment properties.",
    minDown: "3%",
    minCredit: "620+",
    maxLoan: "$766,550",
    features: [
      "Flexible property types",
      "PMI removal at 20% equity",
      "Primary, secondary, and investment",
      "Fixed and adjustable rates",
      "Conforming and jumbo options",
      "Competitive rates for strong credit",
    ],
    badge: null,
    featured: false,
  },
  {
    id: "dscr",
    icon: TrendingUp,
    name: "DSCR Loans",
    tagline: "Investment Property Financing",
    description:
      "Debt Service Coverage Ratio loans qualify based on the property's rental income, not your personal income. Perfect for investors expanding their rental portfolio.",
    minDown: "20%",
    minCredit: "660+",
    maxLoan: "$3,500,000",
    features: [
      "No personal income documentation",
      "Qualification based on rental income",
      "Short-term & long-term rentals",
      "Multiple property types",
      "Foreign national programs available",
      "Fast approval process",
    ],
    badge: "Investors",
    featured: false,
  },
  {
    id: "hometown-heroes",
    icon: Star,
    name: "Hometown Heroes",
    tagline: "Florida's Frontline Benefit Program",
    description:
      "The Florida Hometown Heroes Housing Program helps frontline community workers purchase their first home with down payment and closing cost assistance.",
    minDown: "0%",
    minCredit: "640+",
    maxLoan: "Program limits",
    features: [
      "Down payment assistance",
      "Closing cost assistance",
      "Reduced interest rates",
      "Deferred second mortgage",
      "Available for first-time buyers",
      "Florida residents only",
    ],
    badge: "Featured",
    featured: true,
  },
  {
    id: "first-time-buyer",
    icon: Home,
    name: "First-Time Buyer",
    tagline: "Start Your Homeownership Journey",
    description:
      "Programs designed for first-time homebuyers combining low down payments, favorable interest rates, and educational support to make homeownership accessible.",
    minDown: "3%",
    minCredit: "580+",
    maxLoan: "Program limits",
    features: [
      "Low down payment options",
      "Down payment assistance programs",
      "Homebuyer education resources",
      "Patient, educational approach",
      "FHA and conventional options",
      "Credit counseling available",
    ],
    badge: null,
    featured: false,
  },
];

export default function LoanProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1800&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">Mortgage Programs</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6">
            The Right Loan for{" "}
            <span className="text-[#C5A55A]">Every Dream</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Leo Realty&apos;s licensed loan originators offer a comprehensive range of mortgage
            programs — from first-time buyer assistance to investment property financing.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                id={program.id}
                className={`rounded-2xl p-8 border scroll-mt-24 ${
                  program.featured
                    ? "bg-[#0A1628] border-[#C5A55A]/25 hover:border-[#C5A55A]/50"
                    : "bg-white border-[#E8E4DE] hover:border-[#C5A55A]/30"
                } transition-colors duration-300`}
              >
                <div className="flex items-start justify-between mb-7">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      program.featured ? "bg-[#C5A55A]/15" : "bg-[#0A1628]/5"
                    }`}
                  >
                    <program.icon className="w-6 h-6 text-[#C5A55A]" />
                  </div>
                  {program.badge && (
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                        program.badge === "Featured"
                          ? "bg-[#C5A55A] text-[#0A1628]"
                          : program.featured
                          ? "bg-white/10 text-white/70"
                          : "bg-[#0A1628]/8 text-[#0A1628]"
                      }`}
                    >
                      {program.badge}
                    </span>
                  )}
                </div>

                <div className="text-[#C5A55A] text-[11px] font-semibold uppercase tracking-[0.14em] mb-2">
                  {program.tagline}
                </div>
                <h2
                  className={`font-playfair text-2xl font-bold mb-4 ${
                    program.featured ? "text-white" : "text-[#0A1628]"
                  }`}
                >
                  {program.name}
                </h2>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    program.featured ? "text-white/60" : "text-[#6B7280]"
                  }`}
                >
                  {program.description}
                </p>

                {/* Quick stats */}
                <div
                  className={`grid grid-cols-3 gap-3 p-4 rounded-xl mb-6 text-center ${
                    program.featured ? "bg-white/5" : "bg-[#FAF8F5] border border-[#E8E4DE]"
                  }`}
                >
                  {[
                    { label: "Min Down", value: program.minDown },
                    { label: "Min Credit", value: program.minCredit },
                    { label: "Max Loan", value: program.maxLoan },
                  ].map((s) => (
                    <div key={s.label}>
                      <div
                        className={`font-playfair font-bold text-lg ${
                          program.featured ? "text-[#C5A55A]" : "text-[#0A1628]"
                        }`}
                      >
                        {s.value}
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${
                          program.featured ? "text-white/40" : "text-[#6B7280]"
                        }`}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-7">
                  {program.features.map((f) => (
                    <div
                      key={f}
                      className={`flex items-start gap-2 text-sm ${
                        program.featured ? "text-white/60" : "text-[#6B7280]"
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className={`group inline-flex items-center gap-2 font-semibold text-sm ${
                    program.featured ? "text-[#C5A55A]" : "text-[#C5A55A]"
                  } hover:gap-3 transition-all`}
                >
                  Apply or Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">
            Not Sure Which Program is Right for You?
          </h2>
          <p className="text-[#0A1628]/65 mb-8 max-w-xl mx-auto">
            Our licensed loan originators will evaluate your situation and recommend the best option.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold text-sm px-9 py-4 rounded-full hover:bg-[#152238] transition-colors shadow-xl shadow-[#0A1628]/20"
          >
            Speak With a Loan Originator
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
