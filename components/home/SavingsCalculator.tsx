"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DollarSign, TrendingDown, ArrowRight } from "lucide-react";

const PRESET_PRICES = [250_000, 500_000, 750_000, 1_000_000];

export default function SavingsCalculator() {
  const t = useTranslations("Savings");
  const locale = useLocale();
  const [homePrice, setHomePrice] = useState(500_000);
  const [inputValue, setInputValue] = useState("500000");

  const traditionalCommission = homePrice * 0.06;
  const mrTwoCommission = homePrice * 0.02;
  const savings = traditionalCommission - mrTwoCommission;
  const savingsPercent = 4;

  const localeMap: Record<string, string> = { en: "en-US", fr: "fr-FR", ht: "fr-HT" };
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(localeMap[locale] || "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setHomePrice(Math.min(parsed, 50_000_000));
    }
  };

  const handleInputBlur = () => {
    if (!inputValue || parseInt(inputValue, 10) <= 0) {
      setInputValue("500000");
      setHomePrice(500_000);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="section-label">{t("label")}</span>
          <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-bold text-[#0A1628] leading-tight mb-4">
            {t("headline")}
          </h2>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">{t("subcopy")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white border border-[#E8E4DE] rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-[#0A1628] px-8 py-10 md:px-12">
              <label className="text-white/60 text-xs font-semibold uppercase tracking-[0.14em] mb-3 block">
                {t("salePriceLabel")}
              </label>

              <div className="relative mb-6">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C5A55A] font-bold text-2xl">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue ? parseInt(inputValue, 10).toLocaleString(localeMap[locale] || "en-US") : ""}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="w-full pl-12 pr-6 py-5 bg-white/8 border border-white/15 rounded-xl text-white font-playfair text-3xl font-semibold placeholder-white/20 focus:outline-none focus:border-[#C5A55A]/60 transition-colors"
                  placeholder="500,000"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {PRESET_PRICES.map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => {
                      setHomePrice(price);
                      setInputValue(String(price));
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      homePrice === price
                        ? "bg-[#C5A55A] text-[#0A1628]"
                        : "bg-white/8 text-white/60 hover:bg-white/15 border border-white/15"
                    }`}
                  >
                    {formatCurrency(price)}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-8 py-10 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E4DE]">
                  <div className="text-[#6B7280] text-xs font-semibold uppercase tracking-wider mb-1">
                    {t("traditionalAgent")}
                  </div>
                  <div className="text-[#6B7280] text-xs mb-3">{t("traditionalCommission")}</div>
                  <div className="font-playfair text-2xl font-bold text-[#0A1628]">
                    {formatCurrency(traditionalCommission)}
                  </div>
                  <div className="text-[#9CA3AF] text-xs mt-1">{t("paidInFees")}</div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-[#E8E4DE] font-playfair text-4xl font-light">{t("vs")}</div>
                </div>

                <div className="bg-[#0A1628] rounded-2xl p-6 border border-[#0A1628] relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#C5A55A] text-[#0A1628] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      MR 2%
                    </span>
                  </div>
                  <div className="text-[#C5A55A]/70 text-xs font-semibold uppercase tracking-wider mb-1">
                    {t("leoRealty")}
                  </div>
                  <div className="text-white/50 text-xs mb-3">{t("leoCommission")}</div>
                  <div className="font-playfair text-2xl font-bold text-[#C5A55A]">
                    {formatCurrency(mrTwoCommission)}
                  </div>
                  <div className="text-white/40 text-xs mt-1">{t("paidInFees")}</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#C5A55A]/10 to-[#D4BA7A]/5 border border-[#C5A55A]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#C5A55A]/15 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-6 h-6 text-[#C5A55A]" />
                  </div>
                  <div>
                    <div className="text-[#0A1628] font-semibold text-sm mb-0.5">
                      {t("yourSavings")}
                    </div>
                    <div className="text-[#6B7280] text-xs">
                      {t("lessFees", { percent: savingsPercent })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-playfair text-[clamp(2rem,4vw,2.75rem)] font-bold text-[#C5A55A] leading-none">
                    {formatCurrency(savings)}
                  </div>
                  <div className="text-[#6B7280] text-xs mt-1">{t("keptInPocket")}</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-8 py-4 rounded-full hover:bg-[#D4BA7A] transition-all duration-200 w-full sm:w-auto justify-center"
                >
                  <DollarSign className="w-4 h-4" />
                  {t("ctaPrefix")} {formatCurrency(savings)} {t("ctaSuffix")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <p className="text-[#9CA3AF] text-xs text-center sm:text-left">
                  {t("noObligation")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
