import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

const FALLBACK_TEAM = [
  { id: 1, name: "Leopold Evariste", title: "CEO & Founder", role: "ceo" as const, phone: "(305) 705-2030", email: "leopold@leorealty.com", bio: "", avatarUrl: "/team-leopold.jpg", specialties: [], yearsExperience: 32, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null, isActive: true, displayOrder: 0, slug: "leopold-evariste", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "Joanne Evariste", title: "Office Manager", role: "office_manager" as const, phone: "(305) 705-2030", email: "joanne@leorealty.com", bio: "", avatarUrl: "/team-joanne.jpg", specialties: [], yearsExperience: 15, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null, isActive: true, displayOrder: 1, slug: "joanne-evariste", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "Jean Samuel Luxama", title: "Realtor & Loan Originator", role: "realtor" as const, phone: "(305) 705-2030", email: "jsluxama@leorealty.com", bio: "", avatarUrl: "/team-jean-samuel.jpg", specialties: [], yearsExperience: 8, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null, isActive: true, displayOrder: 2, slug: "jean-samuel-luxama", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Olivier Desire", title: "Loan Originator", role: "loan_originator" as const, phone: "(305) 705-2030", email: "olivier@leorealty.com", bio: "", avatarUrl: "/team-olivier.jpg", specialties: [], yearsExperience: 10, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null, isActive: true, displayOrder: 3, slug: "olivier-desire", createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "Daniel Calixte", title: "Loan Originator", role: "loan_originator" as const, phone: "(305) 705-2030", email: "daniel@leorealty.com", bio: "", avatarUrl: "/team-daniel.jpg", specialties: [], yearsExperience: 7, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null, isActive: true, displayOrder: 4, slug: "daniel-calixte", createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: "Carly Cadet", title: "Realtor Associate", role: "realtor_associate" as const, phone: "(305) 705-2030", email: "carly@leorealty.com", bio: "", avatarUrl: "/team-carly.jpg", specialties: [], yearsExperience: 5, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null, isActive: true, displayOrder: 5, slug: "carly-cadet", createdAt: new Date(), updatedAt: new Date() },
];

export default async function TeamPreview() {
  const team = await getTeamMembers();
  const displayTeam = team.length > 0 ? team.slice(0, 6) : FALLBACK_TEAM;

  return (
    <section className="py-24 md:py-32 bg-[#0A1628] overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #C5A55A 0px, #C5A55A 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, #C5A55A 0px, #C5A55A 1px, transparent 1px, transparent 80px)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="section-label">Our Team</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-bold text-white leading-tight">
              Expert Professionals
              <br />
              <span className="text-[#C5A55A]">Ready to Serve You</span>
            </h2>
          </div>
          <Link
            href="/team"
            className="group inline-flex items-center gap-2 text-white/60 text-sm font-semibold hover:text-[#C5A55A] transition-colors"
          >
            Meet the Full Team
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Team grid — portrait-dominant */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayTeam.map((member) => {
            const photo = member.avatarUrl?.startsWith("/") ? member.avatarUrl : null;
            const externalPhoto = !photo && member.avatarUrl ? member.avatarUrl : null;

            return (
              <div
                key={member.id}
                className="group relative rounded-2xl overflow-hidden cursor-default"
              >
                {/* Portrait */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#152238]">
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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#152238] to-[#0A1628]">
                      <span className="font-playfair text-4xl font-bold text-[#C5A55A]">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Overlay — always visible at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/20 to-transparent" />

                  {/* Name on photo */}
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <div className="text-white font-semibold text-xs leading-snug mb-0.5 truncate">
                      {member.name.split(" ")[0]}
                    </div>
                    <div className="text-[#C5A55A] text-[10px] font-medium truncate">{member.title}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-8 py-4 rounded-full hover:bg-[#D4BA7A] transition-colors shadow-lg shadow-[#C5A55A]/20"
          >
            Schedule a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
