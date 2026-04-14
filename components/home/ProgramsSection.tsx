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
      "From pre-approval to closing, we guide first-time homebuyers through every step. Low down payments, competitive rates, and expert support.",
    href: "/loan-programs#first-time-buyer",
    highlight: "As low as 3% down",
  },
  {
    icon: Star,
    title: "Hometown Heroes",
    tagline: "Serving Those Who Serve",
    description:
      "Special mortgage benefits for Florida's frontline workers — teachers, nurses, law enforcement, firefighters, and more.",
    href: "/loan-programs#hometown-heroes",
    highlight: "Exclusive FL program",
    featured: true,
  },
  {
    icon: Shield,
    title: "FHA Loans",
    tagline: "Government-Backed Confidence",
    description:
      "Accessible financing with flexible credit requirements. Perfect for buyers with moderate credit or limited savings.",
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
    <section className="py-24 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4"
          >
            <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">
              Mortgage Programs
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4"
          >
            Financing For Every Dream
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Leo Realty offers a comprehensive range of mortgage programs.
            Our licensed loan originators find the right fit for your unique situation.
          </motion.p>
        </div>

        {/* Programs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={program.href}
                className={`group block relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  program.featured
                    ? "bg-[#0A1628] text-white"
                    : "bg-white text-[#0A1628] hover:shadow-[#C5A55A]/10"
                }`}
              >
                {program.featured && (
                  <div className="absolute top-4 right-4 bg-[#C5A55A] text-[#0A1628] text-xs font-bold px-3 py-1 rounded-full">
                    FEATURED
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                    program.featured ? "bg-[#C5A55A]/20" : "bg-[#0A1628]/5"
                  }`}
                >
                  <program.icon
                    className={`w-6 h-6 ${program.featured ? "text-[#C5A55A]" : "text-[#C5A55A]"}`}
                  />
                </div>

                <div
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                    program.featured ? "text-[#C5A55A]" : "text-[#C5A55A]"
                  }`}
                >
                  {program.tagline}
                </div>

                <h3
                  className={`text-xl font-bold font-[var(--font-playfair)] mb-3 ${
                    program.featured ? "text-white" : "text-[#0A1628]"
                  }`}
                >
                  {program.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed mb-5 ${
                    program.featured ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {program.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      program.featured
                        ? "bg-white/10 text-white"
                        : "bg-[#0A1628]/5 text-[#0A1628]"
                    }`}
                  >
                    {program.highlight}
                  </span>
                  <ArrowRight
                    className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                      program.featured ? "text-[#C5A55A]" : "text-[#C5A55A]"
                    }`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/loan-programs"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#162447] transition-colors"
          >
            View All Programs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
