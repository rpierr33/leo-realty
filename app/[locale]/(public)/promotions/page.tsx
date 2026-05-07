import type { Metadata } from "next";
import { Tag, Clock, ArrowRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("promotionsTitle"), description: t("promotionsDescription") };
}

export default function PromotionsPage() {
  const t = useTranslations("Promotions");

  const promotions = [
    {
      id: 1, title: t("p1Title"), badge: t("p1Badge"), badgeColor: "bg-green-100 text-green-700",
      description: t("p1Desc"), highlight: t("p1Highlight"),
      details: [t("p1D1"), t("p1D2"), t("p1D3"), t("p1D4"), t("p1D5")],
      cta: t("p1Cta"), href: "/contact", featured: true,
    },
    {
      id: 2, title: t("p2Title"), badge: t("p2Badge"), badgeColor: "bg-orange-100 text-orange-700",
      description: t("p2Desc"), highlight: t("p2Highlight"),
      details: [t("p2D1"), t("p2D2"), t("p2D3"), t("p2D4"), t("p2D5")],
      cta: t("p2Cta"), href: "/loan-programs#hometown-heroes", featured: false,
    },
    {
      id: 3, title: t("p3Title"), badge: t("p3Badge"), badgeColor: "bg-blue-100 text-blue-700",
      description: t("p3Desc"), highlight: t("p3Highlight"),
      details: [t("p3D1"), t("p3D2"), t("p3D3"), t("p3D4"), t("p3D5")],
      cta: t("p3Cta"), href: "/contact", featured: false,
    },
    {
      id: 4, title: t("p4Title"), badge: t("p4Badge"), badgeColor: "bg-purple-100 text-purple-700",
      description: t("p4Desc"), highlight: t("p4Highlight"),
      details: [t("p4D1"), t("p4D2"), t("p4D3"), t("p4D4"), t("p4D5")],
      cta: t("p4Cta"), href: "/contact", featured: false,
    },
    {
      id: 5, title: t("p5Title"), badge: t("p5Badge"), badgeColor: "bg-yellow-100 text-yellow-700",
      description: t("p5Desc"), highlight: t("p5Highlight"),
      details: [t("p5D1"), t("p5D2"), t("p5D3"), t("p5D4"), t("p5D5")],
      cta: t("p5Cta"), href: "/contact", featured: false,
    },
  ];

  return (
    <>
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-[#C5A55A]" />
            <span className="text-[#C5A55A] text-sm font-medium">{t("label")}</span>
          </div>
          <h1 className="text-5xl font-bold text-white font-[var(--font-playfair)] mb-4">
            {t("title1")}{" "}<span className="text-[#C5A55A]">{t("title2")}</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">{t("subcopy")}</p>
        </div>
      </section>

      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`rounded-3xl p-8 border ${
                  promo.featured
                    ? "bg-[#0A1628] border-[#C5A55A]/30 lg:col-span-2"
                    : "bg-white border-gray-100 hover:shadow-lg transition-shadow"
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#C5A55A]" />
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${promo.badgeColor}`}>
                      {promo.badge}
                    </span>
                  </div>
                  {promo.featured && (
                    <div className="flex items-center gap-1 text-[#C5A55A] text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {t("signatureOffer")}
                    </div>
                  )}
                </div>

                <h2 className={`text-2xl font-bold font-[var(--font-playfair)] mb-3 ${promo.featured ? "text-white" : "text-[#0A1628]"}`}>
                  {promo.title}
                </h2>

                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 ${promo.featured ? "bg-[#C5A55A]/20 text-[#C5A55A]" : "bg-[#0A1628]/5 text-[#0A1628]"}`}>
                  <Star className="w-3.5 h-3.5" />
                  <span className="text-sm font-semibold">{promo.highlight}</span>
                </div>

                <p className={`leading-relaxed mb-6 ${promo.featured ? "text-white/70" : "text-gray-600"}`}>
                  {promo.description}
                </p>

                {promo.featured ? (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {promo.details.map((d) => (
                      <div key={d} className="bg-white/10 text-white/80 text-xs text-center px-3 py-2 rounded-lg">
                        {d}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="grid grid-cols-2 gap-2 mb-6">
                    {promo.details.map((d) => (
                      <li key={d} className="text-gray-500 text-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A55A]" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={promo.href}
                  className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-colors ${
                    promo.featured ? "bg-[#C5A55A] text-[#0A1628] hover:bg-[#D4B96A]" : "bg-[#0A1628] text-white hover:bg-[#162447]"
                  }`}
                >
                  {promo.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">{t("ctaTitle")}</h2>
          <p className="text-[#0A1628]/70 mb-8">{t("ctaSubcopy")}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold px-8 py-4 rounded-full hover:bg-[#162447] transition-colors">
            {t("ctaButton")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
