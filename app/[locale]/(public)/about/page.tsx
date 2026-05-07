import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("aboutTitle"), description: t("aboutDescription") };
}
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const revalidate = 300;

async function getTeam() {
  try {
    return await db
      .select()
      .from(agents)
      .where(eq(agents.isActive, true))
      .orderBy(asc(agents.displayOrder));
  } catch {
    return [];
  }
}

const FALLBACK_TEAM = [
  { id: 1, name: "Leopold Evariste", title: "CEO & Founder", avatarUrl: "/team-leopold.jpg" },
  { id: 2, name: "Joanne Evariste", title: "Office Manager", avatarUrl: "/team-joanne.jpg" },
  { id: 3, name: "Jean Samuel Luxama", title: "Realtor & Loan Originator", avatarUrl: "/team-jean-samuel.jpg" },
  { id: 4, name: "Olivier Desire", title: "Loan Originator", avatarUrl: "/team-olivier.jpg" },
  { id: 5, name: "Daniel Calixte", title: "Loan Originator", avatarUrl: "/team-daniel.jpg" },
  { id: 6, name: "Carly Cadet", title: "Realtor Associate", avatarUrl: "/team-carly.jpg" },
];

export default async function AboutPage() {
  const t = await getTranslations("About");
  const team = await getTeam();
  const displayTeam = team.length > 0 ? team : FALLBACK_TEAM;

  const values = [
    { title: t("value1Title"), description: t("value1Desc") },
    { title: t("value2Title"), description: t("value2Desc") },
    { title: t("value3Title"), description: t("value3Desc") },
    { title: t("value4Title"), description: t("value4Desc") },
  ];

  return (
    <>
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('/leopold-hero.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/90 to-[#0A1628]/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">{t("label")}</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6 max-w-3xl">
            {t("title1")}{" "}<span className="text-[#C5A55A]">{t("title2")}</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">{t("subcopy")}</p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">{t("storyLabel")}</span>
              <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.75rem)] font-bold text-[#0A1628] mb-8 leading-tight">
                {t("storyHeadline")}
              </h2>
              <div className="space-y-5 text-[#6B7280] leading-relaxed text-[15px]">
                <p>{t("storyP1")}</p>
                <p>{t("storyP2")}</p>
                <p>{t("storyP3")}</p>
              </div>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 mt-10 bg-[#0A1628] text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-[#152238] transition-colors"
              >
                {t("startCta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <Image src="/leopold-hero.jpg" alt="Leo Realty — Leopold Evariste" width={700} height={500} className="w-full h-[480px] object-cover object-top" />
              </div>
              <div className="absolute -bottom-6 -right-4 md:right-0 bg-[#C5A55A] text-[#0A1628] px-6 py-5 rounded-2xl shadow-2xl">
                <div className="font-playfair text-4xl font-bold leading-none">32+</div>
                <div className="text-[#0A1628]/70 text-xs font-semibold mt-1 uppercase tracking-wide">{t("yearsExcellence")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#152238] border border-white/6 rounded-2xl p-10">
              <div className="text-[#C5A55A] text-[10px] font-bold uppercase tracking-[0.18em] mb-4">{t("missionLabel")}</div>
              <h3 className="font-playfair text-3xl font-bold text-white mb-5">{t("missionTitle")}</h3>
              <p className="text-white/55 leading-relaxed">{t("missionBody")}</p>
            </div>
            <div className="bg-[#C5A55A] rounded-2xl p-10">
              <div className="text-[#0A1628]/60 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">{t("visionLabel")}</div>
              <h3 className="font-playfair text-3xl font-bold text-[#0A1628] mb-5">{t("visionTitle")}</h3>
              <p className="text-[#0A1628]/70 leading-relaxed">{t("visionBody")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-label justify-center">{t("valuesLabel")}</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-[#0A1628]">
              {t("valuesHeadline")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={value.title} className="text-center p-8 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DE] hover:border-[#C5A55A]/30 transition-colors">
                <div className="font-playfair text-5xl font-bold text-[#C5A55A]/20 mb-4 leading-none">0{i + 1}</div>
                <h3 className="font-playfair text-xl font-bold text-[#0A1628] mb-3">{value.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden h-[480px]">
                <Image src="/team-leopold.jpg" alt="Leopold Evariste — CEO & Founder" width={600} height={480} className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#C5A55A] px-5 py-4 rounded-xl">
                <div className="font-playfair text-2xl font-bold text-[#0A1628] leading-none">32+</div>
                <div className="text-[#0A1628]/60 text-[10px] font-bold uppercase tracking-wide mt-1">{t("yearsLeading")}</div>
              </div>
            </div>

            <div>
              <span className="section-label">{t("founderLabel")}</span>
              <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-2 leading-tight">Leopold Evariste</h2>
              <p className="text-[#C5A55A] font-semibold text-sm mb-8 tracking-wide">{t("founderSubtitle")}</p>
              <div className="space-y-4 text-white/55 leading-relaxed text-[15px]">
                <p>{t("founderP1")}</p>
                <p>{t("founderP2")}</p>
                <p>{t("founderP3")}</p>
              </div>
              <div className="flex gap-4 mt-10">
                <a href="tel:+13057052030" className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-7 py-3.5 rounded-full hover:bg-[#D4BA7A] transition-colors">
                  {t("contactLeopoldCta")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="section-label">{t("teamLabel")}</span>
              <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.75rem)] font-bold text-[#0A1628] leading-tight">
                {t("teamHeadline")}
              </h2>
            </div>
            <Link href="/team" className="group inline-flex items-center gap-2 text-[#0A1628] font-semibold text-sm hover:text-[#C5A55A] transition-colors">
              {t("fullTeamLink")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {displayTeam.map((member) => {
              const photo = (member.avatarUrl as string)?.startsWith("/") ? (member.avatarUrl as string) : null;
              const external = !photo && (member.avatarUrl as string) ? (member.avatarUrl as string) : null;
              return (
                <div key={member.id} className="group text-center">
                  <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-[#C5A55A] transition-all duration-300">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={member.name} className="w-full h-full object-cover object-top" />
                    ) : external ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={external} alt={member.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full bg-[#0A1628] flex items-center justify-center">
                        <span className="font-playfair text-[#C5A55A] text-xl font-bold">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[#0A1628] font-semibold text-xs leading-snug">{member.name.split(" ")[0]}</div>
                  <div className="text-[#6B7280] text-[10px]">{(member.title as string)?.split(" ")[0]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-[#0A1628]/65 mb-8 max-w-xl mx-auto">{t("ctaSubcopy")}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold text-sm px-9 py-4 rounded-full hover:bg-[#152238] transition-colors shadow-xl shadow-[#0A1628]/30">
            {t("ctaButton")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
