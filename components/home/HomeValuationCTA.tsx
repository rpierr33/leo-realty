"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Home, Mail, Phone, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function HomeValuationCTA() {
  const t = useTranslations("Valuation");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError(t("errorAddress"));
      return;
    }
    if (!email.trim()) {
      setError(t("errorEmail"));
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError(t("errorPhone"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Valuation",
          lastName: "Request",
          email,
          phone,
          interest: "selling",
          message: `Home valuation request for: ${address}`,
          source: "valuation",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t("errorGeneric"));
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#0A1628] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(197,165,90,0.05) 0px, rgba(197,165,90,0.05) 1px, transparent 1px, transparent 60px)",
        }}
      />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#C5A55A]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-10 h-px bg-[#C5A55A]" />
              <span className="text-[#C5A55A] text-xs font-semibold tracking-[0.18em] uppercase">
                {t("label")}
              </span>
            </div>

            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-bold text-white leading-tight mb-5">
              {t("headline1")}{" "}
              <span className="text-[#C5A55A]">{t("headline2")}</span>
            </h2>

            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
              {t("subcopy")}
            </p>

            <div className="space-y-3">
              {[t("valueProp1"), t("valueProp2"), t("valueProp3")].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {submitted ? (
              <div className="bg-white/8 border border-white/12 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#C5A55A]/15 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-[#C5A55A]" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-3">
                  {t("successTitle")}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t("successCopy")}
                </p>
                <p className="text-white/40 text-xs mt-4">
                  {t("successCallPrefix")}{" "}
                  <a href="tel:+13057052030" className="text-[#C5A55A] hover:underline">
                    (305) 705-2030
                  </a>
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white/8 border border-white/12 rounded-2xl p-8 space-y-4"
              >
                <h3 className="font-playfair text-xl font-semibold text-white mb-2">
                  {t("formTitle")}
                </h3>

                <div>
                  <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2 block">
                    {t("addressLabel")}
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A55A]" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t("addressPlaceholder")}
                      className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C5A55A]/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2 block">
                    {t("emailLabel")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A55A]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C5A55A]/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2 block">
                    {t("phoneLabel")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A55A]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("phonePlaceholder")}
                      className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C5A55A]/60 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#C5A55A] hover:bg-[#D4BA7A] disabled:opacity-60 text-[#0A1628] font-bold py-4 rounded-lg transition-all duration-200 text-sm mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      {t("submitCta")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-white/30 text-xs text-center">
                  {t("privacy")}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
