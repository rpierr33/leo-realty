"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function StatsBar() {
  const t = useTranslations("StatsBar");

  const stats = [
    { value: "32+", label: t("stat1Label"), detail: t("stat1Detail") },
    { value: "1,000+", label: t("stat2Label"), detail: t("stat2Detail") },
    { value: "MR 2%", label: t("stat3Label"), detail: t("stat3Detail") },
    { value: "6", label: t("stat4Label"), detail: t("stat4Detail") },
  ];

  return (
    <section className="relative bg-[#0A1628] overflow-hidden">
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
