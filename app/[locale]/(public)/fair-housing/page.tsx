import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("fairHousingTitle"), description: t("fairHousingDescription") };
}

export default function FairHousingPage() {
  const t = useTranslations("FairHousing");

  const rights = [t("right1"), t("right2"), t("right3"), t("right4"), t("right5")];

  return (
    <div className="bg-[#F8F7F4] pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-[#0A1628] flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-[#C5A55A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">{t("title")}</h1>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-xl text-[#0A1628] font-semibold">{t("intro")}</p>
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <div className="bg-[#0A1628] text-white rounded-2xl p-6">
              <h2 className="text-lg font-bold font-[var(--font-playfair)] mb-3 text-[#C5A55A]">{t("rightsTitle")}</h2>
              <ul className="space-y-2 text-white/80 text-sm">
                {rights.map((right) => (
                  <li key={right}>• {right}</li>
                ))}
              </ul>
            </div>
            <p>{t("hudInfo")}</p>
            <p className="text-sm text-gray-400">{t("contactInfo")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
