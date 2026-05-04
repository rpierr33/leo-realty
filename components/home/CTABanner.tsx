"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative py-24 md:py-32 bg-[#0A1628] overflow-hidden">
      {/* Single horizontal gold accent line at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A55A]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Overline */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#C5A55A]/40" />
            <span className="text-[#C5A55A] text-xs font-semibold tracking-[0.18em] uppercase">
              Start Your Journey
            </span>
            <div className="w-12 h-px bg-[#C5A55A]/40" />
          </div>

          <h2 className="font-playfair text-[clamp(2.2rem,5vw,4rem)] font-medium text-white leading-tight mb-6">
            Your Dream Home
            <br />
            <span className="text-[#C5A55A]">Awaits You</span>
          </h2>

          <p className="text-white/45 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Whether you&apos;re buying, selling, or renting — Leo Realty&apos;s
            team is ready to guide you every step of the way. For mortgage financing,
            our lending partner KLE Mortgage (NMLS #2380070) handles every loan.
            32 years of trust. One call away.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-[#C5A55A] text-[#0A1628] font-semibold text-sm px-9 py-4 rounded-full hover:bg-[#D4BA7A] transition-all"
            >
              Schedule a Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+13057052030"
              className="inline-flex items-center gap-2.5 border border-white/15 text-white font-medium text-sm px-9 py-4 rounded-full hover:bg-white/6 hover:border-white/30 transition-all"
            >
              <Phone className="w-4 h-4" />
              (305) 705-2030
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A55A]/20 to-transparent" />
    </section>
  );
}
