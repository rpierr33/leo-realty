"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "32+", label: "Years of Excellence", detail: "Since 1992" },
  { value: "1,000+", label: "Homes Closed", detail: "Across South Florida" },
  { value: "MR 2%", label: "Commission Rate", detail: "Maximum client savings" },
  { value: "6", label: "Licensed Professionals", detail: "Realtors & loan originators" },
];

export default function StatsBar() {
  return (
    <section className="relative bg-[#0A1628] overflow-hidden">
      {/* Subtle gold accent line at top */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C5A55A]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center md:text-left md:pl-8 first:pl-0 group"
            >
              {/* Vertical divider */}
              {i > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-white/8 hidden md:block" />
              )}

              <div className="font-playfair text-[2.25rem] font-bold text-[#C5A55A] leading-none mb-1.5 tabular-nums">
                {stat.value}
              </div>
              <div className="text-white/90 text-sm font-semibold mb-1">{stat.label}</div>
              <div className="text-white/35 text-xs tracking-wide">{stat.detail}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C5A55A]/20 to-transparent" />
    </section>
  );
}
