"use client";

import { motion } from "framer-motion";
import Link from "next/link";
// Use inline SVG to avoid lucide-react Turbopack module evaluation bug
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}

const programs = [
  {
    title: "Homebuyer Program",
    description: "First-time buyers guided from pre-approval to closing. Low down payments, competitive rates.",
    highlight: "As low as 3% down",
    href: "/loan-programs#first-time-buyer",
  },
  {
    title: "Hometown Heroes",
    description: "Special mortgage benefits for Florida's teachers, nurses, law enforcement, and firefighters.",
    highlight: "Exclusive FL program",
    href: "/loan-programs#hometown-heroes",
    featured: true,
  },
  {
    title: "FHA Loans",
    description: "Government-backed financing with flexible credit requirements. Accessible for moderate credit or limited savings.",
    highlight: "3.5% minimum down",
    href: "/loan-programs#fha",
  },
  {
    title: "VA Loans",
    description: "Zero down payment and no PMI for veterans and active military. You served — let us serve you.",
    highlight: "0% down available",
    href: "/loan-programs#va",
  },
  {
    title: "DSCR Loans",
    description: "Qualify on property cash flow, not personal income. Built for real estate investors expanding their portfolio.",
    highlight: "No income docs needed",
    href: "/loan-programs#dscr",
  },
  {
    title: "USDA Loans",
    description: "Zero down for eligible rural and suburban properties. Government-backed with competitive rates.",
    highlight: "100% financing",
    href: "/loan-programs#usda",
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
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-medium text-[#0A1628] leading-tight">
              Financing For
              <br />
              Every Dream
            </h2>
          </div>
          <p className="text-[#9CA3AF] text-base leading-relaxed lg:text-right max-w-sm lg:ml-auto">
            Our licensed loan originators find the right program for your unique situation — not just the standard option.
          </p>
        </div>

        {/* Programs — editorial text list with gold accent lines */}
        <div className="divide-y divide-[#E8E4DE]">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={program.href}
                className="group flex items-start justify-between gap-8 py-7 hover:bg-[#FAF8F5] transition-colors duration-150 -mx-4 px-4"
              >
                <div className="flex gap-6 items-start">
                  {/* Gold line accent */}
                  <div className="w-px h-full min-h-[2.5rem] bg-[#C5A55A] flex-shrink-0 mt-1.5" style={{ width: "2px" }} />

                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className={`font-playfair font-medium text-lg ${program.featured ? "text-[#C5A55A]" : "text-[#0A1628]"}`}>
                        {program.title}
                      </h3>
                      {program.featured && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A55A] border border-[#C5A55A]/30 px-2 py-0.5">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-[#6B7280] text-sm leading-relaxed max-w-lg">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="text-[#0A1628] text-sm font-medium hidden md:block">
                    {program.highlight}
                  </span>
                  <ArrowRightIcon className="w-4 h-4 text-[#C5A55A] group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/loan-programs"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-medium text-sm px-8 py-4 rounded-full hover:bg-[#152238] transition-colors"
          >
            View All Programs
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
