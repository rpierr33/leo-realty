import type { Metadata } from "next";
import { CheckCircle, ArrowRight, Star, Shield, Home, DollarSign, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LendingPartnerCallout from "@/components/shared/LendingPartnerCallout";
import { FaqSection } from "@/components/seo/FaqSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("loanProgramsTitle"), description: t("loanProgramsDescription") };
}

export default function LoanProgramsPage() {
  const t = useTranslations("LoanPrograms");
  const tFaq = useTranslations("FaqLoanPrograms");
  const tSection = useTranslations("FaqSection");

  const faqItems = [
    { question: tFaq("q1"), answer: tFaq("a1") },
    { question: tFaq("q2"), answer: tFaq("a2") },
    { question: tFaq("q3"), answer: tFaq("a3") },
    { question: tFaq("q4"), answer: tFaq("a4") },
    { question: tFaq("q5"), answer: tFaq("a5") },
    { question: tFaq("q6"), answer: tFaq("a6") },
    { question: tFaq("q7"), answer: tFaq("a7") },
  ];

  const programs = [
    {
      id: "fha", icon: Home, name: t("fhaName"), tagline: t("fhaTagline"), description: t("fhaDesc"),
      minDown: "3.5%", minCredit: "580+", maxLoan: "$498,257",
      features: [t("fhaF1"), t("fhaF2"), t("fhaF3"), t("fhaF4"), t("fhaF5"), t("fhaF6")],
      badge: null, featured: false,
    },
    {
      id: "va", icon: Shield, name: t("vaName"), tagline: t("vaTagline"), description: t("vaDesc"),
      minDown: "0%", minCredit: "620+", maxLoan: "No limit",
      features: [t("vaF1"), t("vaF2"), t("vaF3"), t("vaF4"), t("vaF5"), t("vaF6")],
      badge: t("badgeForVeterans"), featured: false,
    },
    {
      id: "usda", icon: Home, name: t("usdaName"), tagline: t("usdaTagline"), description: t("usdaDesc"),
      minDown: "0%", minCredit: "640+", maxLoan: t("usdaMaxLoan"),
      features: [t("usdaF1"), t("usdaF2"), t("usdaF3"), t("usdaF4"), t("usdaF5"), t("usdaF6")],
      badge: null, featured: false,
    },
    {
      id: "conventional", icon: DollarSign, name: t("convName"), tagline: t("convTagline"), description: t("convDesc"),
      minDown: "3%", minCredit: "620+", maxLoan: "$766,550",
      features: [t("convF1"), t("convF2"), t("convF3"), t("convF4"), t("convF5"), t("convF6")],
      badge: null, featured: false,
    },
    {
      id: "dscr", icon: TrendingUp, name: t("dscrName"), tagline: t("dscrTagline"), description: t("dscrDesc"),
      minDown: "20%", minCredit: "660+", maxLoan: "$3,500,000",
      features: [t("dscrF1"), t("dscrF2"), t("dscrF3"), t("dscrF4"), t("dscrF5"), t("dscrF6")],
      badge: t("badgeInvestors"), featured: false,
    },
    {
      id: "hometown-heroes", icon: Star, name: t("hometownName"), tagline: t("hometownTagline"), description: t("hometownDesc"),
      minDown: "0%", minCredit: "640+", maxLoan: t("hometownMaxLoan"),
      features: [t("hometownF1"), t("hometownF2"), t("hometownF3"), t("hometownF4"), t("hometownF5"), t("hometownF6")],
      badge: t("badgeFeatured"), featured: true,
    },
    {
      id: "first-time-buyer", icon: Home, name: t("ftbName"), tagline: t("ftbTagline"), description: t("ftbDesc"),
      minDown: "3%", minCredit: "580+", maxLoan: t("ftbMaxLoan"),
      features: [t("ftbF1"), t("ftbF2"), t("ftbF3"), t("ftbF4"), t("ftbF5"), t("ftbF6")],
      badge: null, featured: false,
    },
  ];

  return (
    <>
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1800&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">{t("label")}</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6">
            {t("title1")}{" "}<span className="text-[#C5A55A]">{t("title2")}</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">{t("subcopy")}</p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <LendingPartnerCallout />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                id={program.id}
                className={`rounded-2xl p-8 border scroll-mt-24 ${
                  program.featured
                    ? "bg-[#0A1628] border-[#C5A55A]/25 hover:border-[#C5A55A]/50"
                    : "bg-white border-[#E8E4DE] hover:border-[#C5A55A]/30"
                } transition-colors duration-300`}
              >
                <div className="flex items-start justify-between mb-7">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${program.featured ? "bg-[#C5A55A]/15" : "bg-[#0A1628]/5"}`}>
                    <program.icon className="w-6 h-6 text-[#C5A55A]" />
                  </div>
                  {program.badge && (
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                      program.featured && program.badge === t("badgeFeatured")
                        ? "bg-[#C5A55A] text-[#0A1628]"
                        : program.featured
                        ? "bg-white/10 text-white/70"
                        : "bg-[#0A1628]/8 text-[#0A1628]"
                    }`}>
                      {program.badge}
                    </span>
                  )}
                </div>

                <div className="text-[#C5A55A] text-[11px] font-semibold uppercase tracking-[0.14em] mb-2">{program.tagline}</div>
                <h2 className={`font-playfair text-2xl font-bold mb-4 ${program.featured ? "text-white" : "text-[#0A1628]"}`}>
                  {program.name}
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${program.featured ? "text-white/60" : "text-[#6B7280]"}`}>
                  {program.description}
                </p>

                <div className={`grid grid-cols-3 gap-3 p-4 rounded-xl mb-6 text-center ${program.featured ? "bg-white/5" : "bg-[#FAF8F5] border border-[#E8E4DE]"}`}>
                  {[
                    { label: t("minDown"), value: program.minDown },
                    { label: t("minCredit"), value: program.minCredit },
                    { label: t("maxLoan"), value: program.maxLoan },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className={`font-playfair font-bold text-lg ${program.featured ? "text-[#C5A55A]" : "text-[#0A1628]"}`}>
                        {s.value}
                      </div>
                      <div className={`text-xs mt-0.5 ${program.featured ? "text-white/40" : "text-[#6B7280]"}`}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-7">
                  {program.features.map((f) => (
                    <div key={f} className={`flex items-start gap-2 text-sm ${program.featured ? "text-white/60" : "text-[#6B7280]"}`}>
                      <CheckCircle className="w-3.5 h-3.5 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="group inline-flex items-center gap-2 font-semibold text-sm text-[#C5A55A] hover:gap-3 transition-all">
                  {t("applyCta")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection label={tSection("label")} items={faqItems} />

      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">{t("ctaTitle")}</h2>
          <p className="text-[#0A1628]/65 mb-8 max-w-xl mx-auto">{t("ctaSubcopy")}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold text-sm px-9 py-4 rounded-full hover:bg-[#152238] transition-colors shadow-xl shadow-[#0A1628]/20">
            {t("ctaButton")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
