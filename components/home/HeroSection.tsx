"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Search, Phone } from "lucide-react";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Full-bleed parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2000&q=85')",
          y: yBg,
          scale: 1.15,
        }}
      />

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/96 via-[#0A1628]/70 to-[#0A1628]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-24"
        style={{ opacity }}
      >
        <div className="max-w-3xl">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="block w-10 h-px bg-[#C5A55A]" />
            <span className="text-[#C5A55A] text-xs font-semibold tracking-[0.18em] uppercase">
              32 Years In Business · South Florida
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair text-[clamp(2.8rem,6vw,5.5rem)] font-bold text-white leading-[1.06] tracking-tight mb-6"
          >
            <span className="block">MR 2% —</span>
            <span className="block text-[#C5A55A]">No One Does</span>
            <span className="block">It Better</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
          >
            Mortgages Made Easy. Dreams Made Real. South Florida&apos;s most trusted brokerage
            — helping families buy, sell, rent, and finance their dream homes for over three decades.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2.5 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-7 py-4 rounded-full hover:bg-[#D4BA7A] transition-all duration-200 shadow-xl shadow-[#C5A55A]/30 hover:shadow-[#C5A55A]/50 hover:scale-[1.02]"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </Link>
            <a
              href="tel:+13057052030"
              className="inline-flex items-center gap-2.5 border border-white/25 text-white font-semibold text-sm px-7 py-4 rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm"
            >
              <Phone className="w-4 h-4" />
              (305) 705-2030
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-10 pt-8 border-t border-white/12"
          >
            {[
              { value: "32+", label: "Years In Business" },
              { value: "1,000+", label: "Homes Closed" },
              { value: "MR 2%", label: "Commission Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-playfair text-3xl font-bold text-[#C5A55A] leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-white/50 text-xs tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ opacity }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-transparent via-[#C5A55A]/60 to-transparent"
        />
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
