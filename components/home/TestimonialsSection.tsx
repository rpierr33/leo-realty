"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tenant",
    text: "Leo Realty made finding my apartment incredibly easy. They understood exactly what I was looking for and had me in my new place within two weeks. Truly professional service.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Smith",
    role: "First-Time Homebuyer",
    text: "As a first-time homebuyer, I was nervous about the process. The team at Leo Realty walked me through everything. Their MR 2% commission saved me thousands. Couldn't be happier.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Lee",
    role: "Business Owner",
    text: "I needed a commercial property that fit my budget and growth plans. Leo Realty Capital Investments found the perfect location. Their 32 years of experience really shows.",
    rating: 5,
  },
  {
    id: 4,
    name: "James Thompson",
    role: "Property Owner",
    text: "Sold my home in just 21 days at asking price. Leopold's market knowledge and negotiation skills are unmatched. Leo Realty is the gold standard in South Florida real estate.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="section-label">Client Stories</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-bold text-[#0A1628] leading-tight">
              What Our Clients Say
            </h2>
          </div>
          <Link
            href="/testimonials"
            className="group inline-flex items-center gap-2 text-[#0A1628] font-semibold text-sm hover:text-[#C5A55A] transition-colors"
          >
            All Testimonials
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Testimonials — editorial style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Large quote mark */}
              <div className="absolute -top-4 -left-2 font-playfair text-[7rem] leading-none text-[#C5A55A]/12 select-none pointer-events-none">
                &ldquo;
              </div>

              <div className="relative bg-white border border-[#E8E4DE] rounded-2xl p-8 hover:border-[#C5A55A]/30 transition-colors duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 fill-[#C5A55A]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote text */}
                <p className="font-playfair text-[#1A1A1A] text-lg leading-relaxed mb-8 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Attribution */}
                <div className="flex items-center gap-3 pt-5 border-t border-[#E8E4DE]">
                  <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <span className="font-playfair text-[#C5A55A] font-bold text-sm">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1628] text-sm">{t.name}</div>
                    <div className="text-[#6B7280] text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
