"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0A1628] via-[#162447] to-[#0A1628] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #C5A55A 0px, #C5A55A 1px, transparent 1px, transparent 60px)",
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <span className="text-[#C5A55A] text-sm font-medium">
              Ready to Get Started?
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white font-[var(--font-playfair)] mb-6">
            Your Dream Home
            <br />
            <span className="text-[#C5A55A]">Awaits You</span>
          </h2>

          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Whether you&apos;re buying, selling, renting, or financing, Leo Realty&apos;s
            team of experts is ready to guide you every step of the way.
            32 years of trust. One call away.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold px-10 py-4 rounded-full hover:bg-[#D4B96A] transition-all hover:shadow-lg hover:shadow-[#C5A55A]/30"
            >
              Schedule a Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+13057052030"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/20 transition-all"
            >
              <Phone className="w-5 h-5" />
              Call (305) 705-2030
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
