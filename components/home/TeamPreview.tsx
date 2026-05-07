import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

async function getTeamMembers() {
  try {
    return await db
      .select()
      .from(agents)
      .where(eq(agents.isActive, true))
      .orderBy(asc(agents.displayOrder))
      .limit(6);
  } catch {
    return [];
  }
}

const FALLBACK_TEAM_DATA: Array<{
  id: number;
  name: string;
  role: "ceo" | "office_manager" | "realtor" | "loan_originator" | "realtor_associate";
  avatarUrl: string;
}> = [
  { id: 1, name: "Leopold Evariste", role: "ceo", avatarUrl: "/team-leopold.jpg" },
  { id: 2, name: "Joanne Evariste", role: "office_manager", avatarUrl: "/team-joanne.jpg" },
  { id: 3, name: "Jean Samuel Luxama", role: "realtor", avatarUrl: "/team-jean-samuel.jpg" },
  { id: 4, name: "Olivier Desire", role: "loan_originator", avatarUrl: "/team-olivier.jpg" },
  { id: 5, name: "Daniel Calixte", role: "loan_originator", avatarUrl: "/team-daniel.jpg" },
  { id: 6, name: "Carly Cadet", role: "realtor_associate", avatarUrl: "/team-carly.jpg" },
];

export default async function TeamPreview() {
  const t = await getTranslations("Team");
  const team = await getTeamMembers();
  const useFallback = team.length === 0;

  type DisplayMember = { id: number; name: string; title: string; avatarUrl: string | null };
  const displayTeam: DisplayMember[] = useFallback
    ? FALLBACK_TEAM_DATA.map((m) => ({
        id: m.id,
        name: m.name,
        title: t(`title_${m.role}` as `title_${typeof m.role}`),
        avatarUrl: m.avatarUrl,
      }))
    : team.slice(0, 6).map((m) => ({
        id: m.id,
        name: m.name,
        title: m.title,
        avatarUrl: m.avatarUrl,
      }));

  return (
    <section className="py-24 md:py-32 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="section-label">{t("label")}</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-medium text-white leading-tight">
              {t("headline1")}
              <br />
              <span className="text-[#C5A55A]">{t("headline2")}</span>
            </h2>
          </div>
          <Link
            href="/team"
            className="group inline-flex items-center gap-2 text-white/50 text-sm font-medium hover:text-[#C5A55A] transition-colors"
          >
            {t("meetTeam")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayTeam.map((member) => {
            const photo = member.avatarUrl?.startsWith("/") ? member.avatarUrl : null;
            const externalPhoto = !photo && member.avatarUrl ? member.avatarUrl : null;

            return (
              <div key={member.id} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-[#152238] mb-4">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : externalPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={externalPhoto}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#152238]">
                      <span className="font-playfair text-4xl font-medium text-[#C5A55A]">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="w-6 h-px bg-[#C5A55A] mb-2" />
                  <div className="text-white font-medium text-sm leading-snug mb-1">
                    {member.name}
                  </div>
                  <div className="text-white/40 text-xs tracking-wide">{member.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-semibold text-sm px-8 py-4 rounded-full hover:bg-[#D4BA7A] transition-colors"
          >
            {t("scheduleCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
