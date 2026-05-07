import type { Metadata } from "next";
import { Home, DollarSign, Key, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("servicesTitle"), description: t("servicesDescription") };
}

export default function ServicesPage() {
  const t = useTranslations("Services");

  const services = [
    {
      id: "buying",
      icon: Home,
      title: t("buyingTitle"),
      tagline: t("buyingTagline"),
      description: t("buyingDesc"),
      features: [t("buyingF1"), t("buyingF2"), t("buyingF3"), t("buyingF4"), t("buyingF5"), t("buyingF6")],
      cta: t("buyingCta"),
      href: "/properties",
      image: "/service-buy.jpg",
    },
    {
      id: "selling",
      icon: DollarSign,
      title: t("sellingTitle"),
      tagline: t("sellingTagline"),
      description: t("sellingDesc"),
      features: [t("sellingF1"), t("sellingF2"), t("sellingF3"), t("sellingF4"), t("sellingF5"), t("sellingF6")],
      cta: t("sellingCta"),
      href: "/contact",
      image: "/service-sell.jpg",
    },
    {
      id: "renting",
      icon: Key,
      title: t("rentingTitle"),
      tagline: t("rentingTagline"),
      description: t("rentingDesc"),
      features: [t("rentingF1"), t("rentingF2"), t("rentingF3"), t("rentingF4"), t("rentingF5"), t("rentingF6")],
      cta: t("rentingCta"),
      href: "/properties",
      image: "/service-rent.jpg",
    },
    {
      id: "mortgage",
      icon: TrendingUp,
      title: t("mortgageTitle"),
      tagline: t("mortgageTagline"),
      description: t("mortgageDesc"),
      features: [t("mortgageF1"), t("mortgageF2"), t("mortgageF3"), t("mortgageF4"), t("mortgageF5"), t("mortgageF6")],
      cta: t("mortgageCta"),
      href: "/loan-programs",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=85",
    },
  ];

  const stats = [
    { stat: "MR 2%", label: t("stat1Label"), detail: t("stat1Detail") },
    { stat: "32+", label: t("stat2Label"), detail: t("stat2Detail") },
    { stat: "1,000+", label: t("stat3Label"), detail: t("stat3Detail") },
    { stat: "6", label: t("stat4Label"), detail: t("stat4Detail") },
  ];

  return (
    <>
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">{t("label")}</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6">
            {t("title1")}{" "}<span className="text-[#C5A55A]">{t("title2")}</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">{t("subcopy")}</p>
        </div>
      </section>

      <section className="bg-[#FAF8F5]">
        {services.map((service, i) => (
          <div key={service.id} id={service.id} className="grid grid-cols-1 lg:grid-cols-2">
            <div className={`relative h-72 lg:h-auto min-h-96 overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#0A1628]/30" />
              <div className="absolute bottom-6 left-6 w-14 h-14 rounded-2xl bg-[#C5A55A] flex items-center justify-center">
                <service.icon className="w-7 h-7 text-[#0A1628]" />
              </div>
            </div>

            <div className={`flex flex-col justify-center p-10 lg:p-16 bg-white ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <span className="section-label">{service.tagline}</span>
              <h2 className="font-playfair text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#0A1628] mb-4 leading-tight">
                {service.title}
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-7 text-[15px]">{service.description}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[#6B7280] text-sm">
                    <CheckCircle className="w-4 h-4 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="group inline-flex items-center gap-2 bg-[#0A1628] text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-[#152238] transition-colors self-start"
              >
                {service.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="py-24 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-label justify-center">{t("whyLabel")}</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-white">
              {t("whyHeadline")}
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item) => (
              <div key={item.label} className="bg-white/4 border border-white/6 rounded-2xl p-7 text-center hover:border-[#C5A55A]/25 transition-colors">
                <div className="font-playfair text-4xl font-bold text-[#C5A55A] mb-2">{item.stat}</div>
                <div className="text-white font-semibold text-sm mb-2">{item.label}</div>
                <div className="text-white/40 text-xs">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">{t("ctaTitle")}</h2>
          <p className="text-[#0A1628]/65 mb-8">{t("ctaSubcopy")}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold text-sm px-9 py-4 rounded-full hover:bg-[#152238] transition-colors shadow-xl shadow-[#0A1628]/20">
            {t("ctaButton")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
