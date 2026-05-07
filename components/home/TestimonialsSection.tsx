"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export default function TestimonialsSection() {
  const t = useTranslations("Testimonials");

  const testimonials = [
    { id: 1, name: t("t1Name"), role: t("t1Role"), text: t("t1Text"), rating: 5 },
    { id: 2, name: t("t2Name"), role: t("t2Role"), text: t("t2Text"), rating: 5 },
    { id: 3, name: t("t3Name"), role: t("t3Role"), text: t("t3Text"), rating: 5 },
    { id: 4, name: t("t4Name"), role: t("t4Role"), text: t("t4Text"), rating: 5 },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="section-label">{t("label")}</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-bold text-[#0A1628] leading-tight">
              {t("headline")}
            </h2>
          </div>
          <Link
            href="/testimonials"
            className="group inline-flex items-center gap-2 text-[#0A1628] font-semibold text-sm hover:text-[#C5A55A] transition-colors"
          >
            {t("viewAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((tm, i) => (
            <motion.div
              key={tm.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute -top-4 -left-2 font-playfair text-[7rem] leading-none text-[#C5A55A]/12 select-none pointer-events-none">
                &ldquo;
              </div>

              <div className="relative bg-white border border-[#E8E4DE] rounded-2xl p-8 hover:border-[#C5A55A]/30 transition-colors duration-300">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: tm.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 fill-[#C5A55A]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="font-playfair text-[#1A1A1A] text-lg leading-relaxed mb-8 italic">
                  &ldquo;{tm.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-[#E8E4DE]">
                  <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <span className="font-playfair text-[#C5A55A] font-bold text-sm">
                      {tm.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1628] text-sm">{tm.name}</div>
                    <div className="text-[#6B7280] text-xs">{tm.role}</div>
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
