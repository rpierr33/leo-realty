import type { Metadata } from "next";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("teamTitle"), description: t("teamDescription") };
}

async function getTeam() {
  try {
    return await db.select().from(agents).where(eq(agents.isActive, true)).orderBy(asc(agents.displayOrder));
  } catch {
    return [];
  }
}

export default async function TeamPage() {
  const t = await getTranslations("TeamPage");
  const tTeam = await getTranslations("Team");
  const dbTeam = await getTeam();

  const TEAM_DATA = [
    { id: 1, slug: "leopold-evariste", name: "Leopold Evariste", title: tTeam("title_ceo"), role: "ceo", phone: "(305) 705-2030", email: "leopold@leorealty.com", bio: t("bio_leopold"), avatarUrl: "/team-leopold.jpg", specialties: ["Luxury Properties", "Investment Properties", "Commercial Real Estate", "1031 Exchanges"], yearsExperience: 32 },
    { id: 2, slug: "joanne-evariste", name: "Joanne Evariste", title: tTeam("title_office_manager"), role: "office_manager", phone: "(305) 705-2030", email: "joanne@leorealty.com", bio: t("bio_joanne"), avatarUrl: "/team-joanne.jpg", specialties: ["Operations", "Client Relations", "Transaction Coordination"], yearsExperience: 15 },
    { id: 3, slug: "jean-samuel-luxama", name: "Jean Samuel Luxama", title: tTeam("title_realtor"), role: "realtor", phone: "(305) 705-2030", email: "jsluxama@leorealty.com", bio: t("bio_jeansamuel"), avatarUrl: "/team-jean-samuel.jpg", specialties: ["Residential Real Estate", "FHA Loans", "First-Time Buyers", "Hometown Heroes"], yearsExperience: 8 },
    { id: 4, slug: "olivier-desire", name: "Olivier Desire", title: tTeam("title_loan_originator"), role: "loan_originator", phone: "(305) 705-2030", email: "olivier@leorealty.com", bio: t("bio_olivier"), avatarUrl: "/team-olivier.jpg", specialties: ["DSCR Loans", "USDA Loans", "Conventional Financing", "Investment Properties"], yearsExperience: 10 },
    { id: 5, slug: "daniel-calixte", name: "Daniel Calixte", title: tTeam("title_loan_originator"), role: "loan_originator", phone: "(305) 705-2030", email: "daniel@leorealty.com", bio: t("bio_daniel"), avatarUrl: "/team-daniel.jpg", specialties: ["VA Loans", "FHA Loans", "Refinancing", "Credit Improvement"], yearsExperience: 7 },
    { id: 6, slug: "carly-cadet", name: "Carly Cadet", title: tTeam("title_realtor_associate"), role: "realtor_associate", phone: "(305) 705-2030", email: "carly@leorealty.com", bio: t("bio_carly"), avatarUrl: "/team-carly.jpg", specialties: ["Residential Homes", "Condominiums", "First-Time Buyers", "Rentals"], yearsExperience: 5 },
  ];

  type TeamMember = {
    id: number; name: string; title: string; phone: string; email: string;
    bio: string; avatarUrl: string | null; specialties: string[]; yearsExperience: number;
  };
  const team: TeamMember[] = dbTeam.length > 0
    ? dbTeam.map((m) => ({ ...m, bio: m.bio || "", specialties: (m.specialties as string[]) || [] }))
    : TEAM_DATA;

  return (
    <>
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1800&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {team.map((member) => {
              const photo = member.avatarUrl?.startsWith("/") ? member.avatarUrl : null;
              const external = !photo && member.avatarUrl ? member.avatarUrl : null;

              return (
                <div key={member.id} className="group bg-white rounded-2xl overflow-hidden border border-[#E8E4DE] hover:border-[#C5A55A]/30 hover:shadow-2xl hover:shadow-[#0A1628]/8 transition-all duration-300">
                  <div className="relative h-72 overflow-hidden bg-[#0A1628]/5">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out" />
                    ) : external ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={external} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#152238]">
                        <span className="font-playfair text-white text-6xl font-bold">{member.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <div className="font-playfair text-white font-bold text-xl">{member.name}</div>
                      <div className="text-[#C5A55A] text-sm font-medium">{member.title}</div>
                    </div>
                  </div>

                  <div className="p-6">
                    {member.bio && (
                      <p className="text-[#6B7280] text-sm leading-relaxed mb-5 line-clamp-3">{member.bio}</p>
                    )}

                    {member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {member.specialties.slice(0, 3).map((s) => (
                          <span key={s} className="bg-[#0A1628]/5 text-[#0A1628] text-[11px] font-medium px-3 py-1 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {member.yearsExperience > 0 && (
                      <div className="text-[#C5A55A] text-xs font-semibold mb-5 tracking-wide uppercase">
                        {t("yearsExperience", { years: member.yearsExperience })}
                      </div>
                    )}

                    <div className="space-y-2 pt-4 border-t border-[#E8E4DE]">
                      <a href={`tel:${member.phone}`} className="flex items-center gap-2.5 text-[#6B7280] text-sm hover:text-[#C5A55A] transition-colors">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        {member.phone}
                      </a>
                      <a href={`mailto:${member.email}`} className="flex items-center gap-2.5 text-[#6B7280] text-sm hover:text-[#C5A55A] transition-colors truncate">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
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
