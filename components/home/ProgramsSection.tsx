"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Shield, DollarSign, Star, TrendingUp, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: Home,
    title: "Homebuyer Program",
    tagline: "First Home Made Simple",
    description:
      "From pre-approval to closing, we guide first-time homebuyers through every step with low down payments and competitive rates.",
    href: "/loan-programs#first-time-buyer",
    highlight: "As low as 3% down",
  },
  {
    icon: Star,
    title: "Hometown Heroes",
    tagline: "Serving Those Who Serve",
    description:
      "Special mortgage benefits for Florida's frontline workers — teachers, nurses, law enforcement, and firefighters.",
    href: "/loan-programs#hometown-heroes",
    highlight: "Exclusive FL program",
    featured: true,
  },
  {
    icon: Shield,
    title: "FHA Loans",
    tagline: "Government-Backed Confidence",
    description:
      "Accessible financing with flexible credit requirements, perfect for buyers with moderate credit or limited savings.",
    href: "/loan-programs#fha",
    highlight: "3.5% minimum down",
  },
  {
    icon: DollarSign,
    title: "VA Loans",
    tagline: "For Our Veterans & Service Members",
    description:
      "Zero down payment options and no PMI for veterans and active military. You served our country — let us serve you.",
    href: "/loan-programs#va",
    highlight: "0% down available",
  },
  {
    icon: TrendingUp,
    title: "DSCR Loans",
    tagline: "Investment Property Financing",
    description:
      "Qualify based on property cash flow, not personal income. Ideal for real estate investors expanding their portfolio.",
    href: "/loan-programs#dscr",
    highlight: "No income docs needed",
  },
  {
    icon: Home,
    title: "USDA Loans",
    tagline: "Rural Area Advantages",
    description:
      "Zero down payment for eligible rural and suburban properties. Competitive rates with government backing.",
    href: "/loan-programs#usda",
    highlight: "100% financing",
  },
];

export default function ProgramsSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <span className="section-label">Mortgage Programs</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-bold text-[#0A1628] leading-tight">
              Financing For
              <br />
              Every Dream
            </h2>
          </div>
          <p className="text-[#6B7280] text-lg leading-relaxed lg:text-right">
            Leo Realty offers a comprehensive range of mortgage programs.
            Our licensed loan originators find the right fit for your unique situation.
          </p>
        </div>

        {/* Programs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={program.href}
                className={`group flex flex-col h-full rounded-2xl p-7 transition-all duration-250 hover:-translate-y-0.5 border ${
                  program.featured
                    ? "bg-[#0A1628] border-[#C5A55A]/20 hover:border-[#C5A55A]/50 hover:shadow-xl hover:shadow-[#0A1628]/30"
                    : "bg-[#FAF8F5] border-[#E8E4DE] hover:border-[#C5A55A]/30 hover:shadow-lg hover:shadow-black/5"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                    program.featured ? "bg-[#C5A55A]/15" : "bg-[#0A1628]/6"
                  }`}
                >
                  <program.icon
                    className={`w-5 h-5 ${program.featured ? "text-[#C5A55A]" : "text-[#C5A55A]"}`}
                  />
                </div>

                <div
                  className={`text-[11px] font-semibold uppercase tracking-[0.14em] mb-2 ${
                    program.featured ? "text-[#C5A55A]" : "text-[#C5A55A]"
                  }`}
                >
                  {program.tagline}
                </div>

                <h3
                  className={`font-playfair text-xl font-bold mb-3 ${
                    program.featured ? "text-white" : "text-[#0A1628]"
                  }`}
                >
                  {program.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed flex-1 mb-6 ${
                    program.featured ? "text-white/60" : "text-[#6B7280]"
                  }`}
                >
                  {program.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/8">
                  <span
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${
                      program.featured
                        ? "bg-[#C5A55A]/15 text-[#C5A55A]"
                        : "bg-[#0A1628]/6 text-[#0A1628]"
                    }`}
                  >
                    {program.highlight}
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ${
                      program.featured ? "text-[#C5A55A]" : "text-[#C5A55A]"
                    }`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/loan-programs"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-semibold text-sm px-8 py-4 rounded-full hover:bg-[#152238] transition-colors shadow-lg shadow-[#0A1628]/20"
          >
            View All Programs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
