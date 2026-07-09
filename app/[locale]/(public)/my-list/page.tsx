import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MyListClient from "@/components/properties/MyListClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Reactions" });
  return {
    title: `${t("myListTitle")} — Leo Realty`,
    robots: { index: false, follow: false },
  };
}

export default async function MyListPage() {
  const t = await getTranslations("Reactions");
  return (
    <>
      <section className="relative bg-[#0A1628] pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">{t("myListLabel")}</span>
          <h1 className="font-playfair text-[clamp(2.4rem,5vw,4rem)] font-bold text-white leading-tight mb-4">
            {t("myListTitle")}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">{t("myListSubtitle")}</p>
        </div>
      </section>
      <section className="py-14 bg-[#FAF8F5] min-h-[40vh]">
        <MyListClient />
      </section>
    </>
  );
}
