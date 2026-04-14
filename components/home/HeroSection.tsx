"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Phone, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/95 via-[#0A1628]/75 to-[#0A1628]/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-[#C5A55A] fill-[#C5A55A]" />
            <span className="text-[#C5A55A] text-sm font-medium">
              32 Years In Business · Trusted By Thousands
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-[var(--font-playfair)] mb-6"
          >
            MR 2%{" "}
            <span className="text-[#C5A55A]">No One</span>
            <br />
            Does It Better
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/75 text-lg md:text-xl leading-relaxed mb-8"
          >
            Mortgages Made Easy, Dreams Made Real. Leo Realty Capital Investments
            has been South Florida&apos;s most trusted brokerage for over three decades —
            helping families buy, sell, rent, and finance their dream homes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold px-8 py-4 rounded-full hover:bg-[#D4B96A] transition-all hover:shadow-lg hover:shadow-[#C5A55A]/30"
            >
              <Search className="w-5 h-5" />
              Search Properties
            </Link>
            <a
              href="tel:+13057052030"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <Phone className="w-5 h-5" />
              (305) 705-2030
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-8"
          >
            {[
              { value: "32+", label: "Years In Business" },
              { value: "6", label: "Expert Team Members" },
              { value: "1000+", label: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[#C5A55A] font-[var(--font-playfair)]">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C5A55A]/60" />
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
