import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("privacyTitle"), description: t("privacyDescription") };
}

export default function PrivacyPage() {
  const t = useTranslations("Privacy");
  const tLegal = useTranslations("Legal");

  const sections = [
    { title: t("s1Title"), body: t("s1Body") },
    { title: t("s2Title"), body: t("s2Body") },
    { title: t("s3Title"), body: t("s3Body") },
    { title: t("s4Title"), body: t("s4Body") },
    { title: t("s5Title"), body: t("s5Body") },
  ];

  return (
    <div className="bg-[#F8F7F4] pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[#C5A55A] text-sm font-semibold">{tLegal("label")}</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-2">{t("title")}</h1>
          <p className="text-gray-400 text-sm mb-10">{tLegal("lastUpdated", { date: t("lastUpdatedDate") })}</p>

          <div className="prose prose-gray max-w-none space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
