import type { Metadata } from "next";
import { Star, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("testimonialsTitle"), description: t("testimonialsDescription") };
}

export default function TestimonialsPage() {
  const t = useTranslations("TestimonialsPage");

  const testimonials = [
    { id: 1, name: t("t1Name"), role: t("t1Role"), text: t("t1Text"), rating: 5, category: t("categoryRenting"), date: t("t1Date") },
    { id: 2, name: t("t2Name"), role: t("t2Role"), text: t("t2Text"), rating: 5, category: t("categoryBuying"), date: t("t2Date") },
    { id: 3, name: t("t3Name"), role: t("t3Role"), text: t("t3Text"), rating: 5, category: t("categoryCommercial"), date: t("t3Date") },
    { id: 4, name: t("t4Name"), role: t("t4Role"), text: t("t4Text"), rating: 5, category: t("categoryInvestment"), date: t("t4Date") },
    { id: 5, name: t("t5Name"), role: t("t5Role"), text: t("t5Text"), rating: 5, category: t("categorySelling"), date: t("t5Date") },
  ];

  return (
    <>
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">{t("label")}</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6">
            {t("title1")}{" "}<span className="text-[#C5A55A]">{t("title2")}</span>
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-[#C5A55A] text-[#C5A55A]" />
              ))}
            </div>
            <span className="text-white/55 text-sm">{t("averageRating")}</span>
          </div>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">{t("subcopy")}</p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {testimonials.map((tm, i) => (
              <div
                key={tm.id}
                className={`relative bg-white border border-[#E8E4DE] rounded-2xl p-10 md:p-12 hover:border-[#C5A55A]/30 transition-colors duration-300 ${
                  i === 0 ? "lg:grid lg:grid-cols-5 lg:gap-12" : ""
                }`}
              >
                <div className="absolute top-6 right-8 font-playfair text-[8rem] leading-none text-[#C5A55A]/8 select-none pointer-events-none font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className={i === 0 ? "lg:col-span-3" : ""}>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-[#C5A55A] mb-5">
                    {tm.category}
                  </span>

                  <p className="font-playfair text-[#1A1A1A] text-xl md:text-2xl leading-relaxed italic mb-8">
                    &ldquo;{tm.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <span className="font-playfair text-[#C5A55A] font-bold text-lg">{tm.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#0A1628] text-sm">{tm.name}</div>
                      <div className="text-[#6B7280] text-xs">{tm.role} · {tm.date}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: tm.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-[#C5A55A] text-[#C5A55A]" />
                      ))}
                    </div>
                  </div>
                </div>

                {i === 0 && (
                  <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
                    <div className="text-center p-8 bg-[#0A1628] rounded-2xl w-full">
                      <div className="font-playfair text-5xl font-bold text-[#C5A55A] mb-2">5.0</div>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-5 h-5 fill-[#C5A55A] text-[#C5A55A]" />
                        ))}
                      </div>
                      <div className="text-white/50 text-sm">{t("averageRatingLabel")}</div>
                      <div className="text-white/30 text-xs mt-1">{t("reviewCount")}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">{t("ctaSubcopy")}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-9 py-4 rounded-full hover:bg-[#D4BA7A] transition-colors">
            {t("ctaButton")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
