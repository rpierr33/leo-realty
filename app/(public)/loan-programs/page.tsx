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
      "FHA loans are backed by the Federal Housing Administration and offer flexible qualification requirements. Ideal for buyers with moderate credit scores or limited savings for a down payment.",
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
    requirements: [
      "Minimum 3.5% down payment",
      "Credit score of 580+ (10% down for 500-579)",
      "Steady employment history (2 years)",
      "Debt-to-income ratio under 43%",
      "Property must meet FHA standards",
    ],
    badge: null,
  },
  {
    id: "va",
    icon: Shield,
    name: "VA Loans",
    tagline: "Honoring Our Veterans",
    description:
      "VA loans are exclusively available to veterans, active-duty service members, and eligible surviving spouses. They offer outstanding benefits including no down payment and no private mortgage insurance.",
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
    requirements: [
      "Veteran, active-duty, or eligible spouse",
      "Valid Certificate of Eligibility (COE)",
      "Minimum credit score ~620",
      "Stable income and employment",
      "Primary residence purchase",
    ],
    badge: "For Veterans",
  },
  {
    id: "usda",
    icon: Home,
    name: "USDA Loans",
    tagline: "Rural & Suburban Opportunities",
    description:
      "USDA loans provide 100% financing for eligible rural and suburban properties. Backed by the U.S. Department of Agriculture, these loans offer competitive rates and no down payment.",
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
    requirements: [
      "Property in eligible rural/suburban area",
      "Income at or below 115% of area median",
      "Credit score of 640+",
      "Stable employment and income",
      "No outstanding federal judgments",
    ],
    badge: null,
  },
  {
    id: "conventional",
    icon: DollarSign,
    name: "Conventional Loans",
    tagline: "Flexible Standard Financing",
    description:
      "Conventional loans are not government-backed and offer flexibility for buyers with strong credit. Available for primary residences, second homes, and investment properties.",
    minDown: "3%",
    minCredit: "620+",
    maxLoan: "$766,550",
    features: [
      "Flexible property types",
      "PMI removal when 20% equity reached",
      "Primary, secondary, and investment",
      "Fixed and adjustable rates",
      "Conforming and jumbo options",
      "Competitive rates for strong credit",
    ],
    requirements: [
      "Minimum 3-20% down payment",
      "Credit score of 620+",
      "Debt-to-income ratio under 45%",
      "Consistent income documentation",
      "Stable employment history",
    ],
    badge: null,
  },
  {
    id: "dscr",
    icon: TrendingUp,
    name: "DSCR Loans",
    tagline: "Investment Property Financing",
    description:
      "Debt Service Coverage Ratio (DSCR) loans qualify based on the property's rental income, not your personal income. Perfect for investors expanding their rental portfolio.",
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
    requirements: [
      "DSCR ratio of 1.0 or higher",
      "Minimum 20-25% down payment",
      "Credit score of 660+",
      "Property must generate rental income",
      "Investment properties only",
    ],
    badge: "Investors",
  },
  {
    id: "hometown-heroes",
    icon: Star,
    name: "Hometown Heroes",
    tagline: "Florida's Frontline Benefit Program",
    description:
      "The Florida Hometown Heroes Housing Program helps frontline community workers purchase their first home. It provides down payment and closing cost assistance for eligible buyers.",
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
    requirements: [
      "Florida frontline worker (teacher, nurse, law enforcement, etc.)",
      "First-time homebuyer or not owned in 3 years",
      "Income within program limits",
      "Complete homebuyer education course",
      "Primary residence in Florida",
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
      "Specially designed programs for first-time homebuyers combining low down payments, favorable interest rates, and educational support to make homeownership accessible.",
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
    requirements: [
      "First-time homebuyer status",
      "Minimum credit score of 580+",
      "Complete homebuyer education",
      "Stable income documentation",
      "Property as primary residence",
    ],
    badge: null,
  },
];

export default function LoanProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <span className="text-[#C5A55A] text-sm font-medium">Mortgage Programs</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-[var(--font-playfair)] mb-6">
            The Right Loan for{" "}
            <span className="text-[#C5A55A]">Every Dream</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            Leo Realty&apos;s licensed loan originators offer a comprehensive range of mortgage
            programs — from first-time buyer assistance to investment property financing.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                id={program.id}
                className={`rounded-3xl p-8 border ${
                  program.featured
                    ? "bg-[#0A1628] border-[#C5A55A]/30"
                    : "bg-white border-gray-100"
                } scroll-mt-24`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    program.featured ? "bg-[#C5A55A]/20" : "bg-[#0A1628]/5"
                  }`}>
                    <program.icon className="w-6 h-6 text-[#C5A55A]" />
                  </div>
                  {program.badge && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      program.badge === "Featured"
                        ? "bg-[#C5A55A] text-[#0A1628]"
                        : "bg-[#0A1628]/10 text-[#0A1628]"
                    }`}>
                      {program.badge}
                    </span>
                  )}
                </div>

                <div className={`text-xs font-semibold uppercase tracking-wider mb-2 text-[#C5A55A]`}>
                  {program.tagline}
                </div>
                <h2 className={`text-2xl font-bold font-[var(--font-playfair)] mb-3 ${
                  program.featured ? "text-white" : "text-[#0A1628]"
                }`}>
                  {program.name}
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${
                  program.featured ? "text-white/70" : "text-gray-600"
                }`}>
                  {program.description}
                </p>

                {/* Quick stats */}
                <div className={`grid grid-cols-3 gap-3 p-4 rounded-xl mb-6 ${
                  program.featured ? "bg-white/5" : "bg-[#F8F7F4]"
                }`}>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${program.featured ? "text-[#C5A55A]" : "text-[#0A1628]"}`}>
                      {program.minDown}
                    </div>
                    <div className={`text-xs ${program.featured ? "text-white/50" : "text-gray-400"}`}>Min Down</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${program.featured ? "text-[#C5A55A]" : "text-[#0A1628]"}`}>
                      {program.minCredit}
                    </div>
                    <div className={`text-xs ${program.featured ? "text-white/50" : "text-gray-400"}`}>Min Credit</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-base font-bold ${program.featured ? "text-[#C5A55A]" : "text-[#0A1628]"}`}>
                      {program.maxLoan}
                    </div>
                    <div className={`text-xs ${program.featured ? "text-white/50" : "text-gray-400"}`}>Max Loan</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                    program.featured ? "text-white/60" : "text-gray-400"
                  }`}>
                    Key Benefits
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {program.features.map((f) => (
                      <div key={f} className={`flex items-center gap-2 text-sm ${
                        program.featured ? "text-white/70" : "text-gray-600"
                      }`}>
                        <CheckCircle className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact"
                  className={`inline-flex items-center gap-2 font-semibold text-sm mt-2 ${
                    program.featured
                      ? "text-[#C5A55A] hover:text-[#D4B96A]"
                      : "text-[#C5A55A] hover:text-[#0A1628]"
                  } transition-colors`}
                >
                  Apply or Learn More <ArrowRight className="w-4 h-4" />
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
            Not Sure Which Program is Right for You?
          </h2>
          <p className="text-[#0A1628]/70 mb-8">
            Our licensed loan originators will evaluate your situation and recommend the best option.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold px-8 py-4 rounded-full hover:bg-[#162447] transition-colors"
          >
            Speak With a Loan Originator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
