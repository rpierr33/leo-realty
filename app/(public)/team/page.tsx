import { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Meet The Team — Our Licensed Real Estate Professionals",
  description:
    "Meet Leo Realty's team of 6 expert realtors and loan originators dedicated to helping South Florida families.",
};

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

const TEAM_DATA = [
  { id: 1, slug: "leopold-evariste", name: "Leopold Evariste", title: "CEO & Founder", role: "ceo", phone: "(305) 705-2030", email: "leopold@leorealty.com", bio: "Leopold Evariste founded Leo Realty Capital Investments in 1992 with a mission to transform the South Florida real estate experience. His pioneering MR 2% commission model has saved clients millions while delivering white-glove service. With over 32 years of market expertise, Leopold has navigated every cycle of the South Florida market and built a reputation as one of the region's most trusted brokers.", avatarUrl: "/team-leopold.jpg", specialties: ["Luxury Properties", "Investment Properties", "Commercial Real Estate", "1031 Exchanges"], yearsExperience: 32, isActive: true, displayOrder: 0, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 2, slug: "joanne-evariste", name: "Joanne Evariste", title: "Office Manager", role: "office_manager", phone: "(305) 705-2030", email: "joanne@leorealty.com", bio: "Joanne Evariste is the backbone of Leo Realty's operations. With meticulous attention to detail and a warm, client-first approach, she ensures every transaction runs smoothly. Joanne coordinates between agents, clients, lenders, and closing attorneys to deliver a seamless experience.", avatarUrl: "/team-joanne.jpg", specialties: ["Operations", "Client Relations", "Transaction Coordination"], yearsExperience: 15, isActive: true, displayOrder: 1, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 3, slug: "jean-samuel-luxama", name: "Jean Samuel Luxama", title: "Realtor & Loan Originator", role: "realtor", phone: "(305) 705-2030", email: "jsluxama@leorealty.com", bio: "Dual-licensed as both a Realtor and Loan Originator, Jean Samuel provides a uniquely seamless experience — helping clients find their perfect property AND securing the best financing. His comprehensive approach saves clients time, money, and stress.", avatarUrl: "/team-jean-samuel.jpg", specialties: ["Residential Real Estate", "FHA Loans", "First-Time Buyers", "Hometown Heroes"], yearsExperience: 8, isActive: true, displayOrder: 2, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 4, slug: "olivier-desire", name: "Olivier Desire", title: "Loan Originator", role: "loan_originator", phone: "(305) 705-2030", email: "olivier@leorealty.com", bio: "Olivier Desire specializes in investment property financing and complex mortgage scenarios. His expertise in DSCR loans, USDA programs, and conventional financing makes him an invaluable resource for both first-time buyers and seasoned investors.", avatarUrl: "/team-olivier.jpg", specialties: ["DSCR Loans", "USDA Loans", "Conventional Financing", "Investment Properties"], yearsExperience: 10, isActive: true, displayOrder: 3, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 5, slug: "daniel-calixte", name: "Daniel Calixte", title: "Loan Originator", role: "loan_originator", phone: "(305) 705-2030", email: "daniel@leorealty.com", bio: "Daniel Calixte is known for his deep knowledge of VA and FHA loan programs and his dedication to making the mortgage process stress-free. He takes time to educate clients about their options, ensuring they make informed decisions aligned with their long-term goals.", avatarUrl: "/team-daniel.jpg", specialties: ["VA Loans", "FHA Loans", "Refinancing", "Credit Improvement"], yearsExperience: 7, isActive: true, displayOrder: 4, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 6, slug: "carly-cadet", name: "Carly Cadet", title: "Realtor Associate", role: "realtor_associate", phone: "(305) 705-2030", email: "carly@leorealty.com", bio: "Carly Cadet brings energy, market knowledge, and a genuine passion for real estate to every client relationship. Specializing in residential homes and condominiums throughout Miami-Dade County, she has a talent for matching clients with properties that truly feel like home.", avatarUrl: "/team-carly.jpg", specialties: ["Residential Homes", "Condominiums", "First-Time Buyers", "Rentals"], yearsExperience: 5, isActive: true, displayOrder: 5, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
];

export default async function TeamPage() {
  const dbTeam = await getTeam();
  const team = dbTeam.length > 0 ? dbTeam : TEAM_DATA;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1800&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">Our Team</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6 max-w-3xl">
            Meet Your{" "}
            <span className="text-[#C5A55A]">Expert Team</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Six dedicated real estate professionals — licensed realtors, loan originators,
            and support staff — all committed to delivering exceptional results.
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {team.map((member) => {
              const photo = (member.avatarUrl as string)?.startsWith("/") ? member.avatarUrl as string : null;
              const external = !photo && (member.avatarUrl as string) ? member.avatarUrl as string : null;

              return (
                <div
                  key={member.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E8E4DE] hover:border-[#C5A55A]/30 hover:shadow-2xl hover:shadow-[#0A1628]/8 transition-all duration-300"
                >
                  {/* Portrait — tall */}
                  <div className="relative h-72 overflow-hidden bg-[#0A1628]/5">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                    ) : external ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={external}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#152238]">
                        <span className="font-playfair text-white text-6xl font-bold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />
                    {/* Name on photo */}
                    <div className="absolute bottom-4 left-5 right-5">
                      <div className="font-playfair text-white font-bold text-xl">{member.name}</div>
                      <div className="text-[#C5A55A] text-sm font-medium">{member.title as string}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {member.bio && (
                      <p className="text-[#6B7280] text-sm leading-relaxed mb-5 line-clamp-3">
                        {member.bio as string}
                      </p>
                    )}

                    {/* Specialties */}
                    {member.specialties && (member.specialties as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {(member.specialties as string[]).slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="bg-[#0A1628]/5 text-[#0A1628] text-[11px] font-medium px-3 py-1 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Experience */}
                    {(member.yearsExperience as number) > 0 && (
                      <div className="text-[#C5A55A] text-xs font-semibold mb-5 tracking-wide uppercase">
                        {member.yearsExperience as number}+ Years Experience
                      </div>
                    )}

                    {/* Contact */}
                    <div className="space-y-2 pt-4 border-t border-[#E8E4DE]">
                      <a
                        href={`tel:${member.phone as string}`}
                        className="flex items-center gap-2.5 text-[#6B7280] text-sm hover:text-[#C5A55A] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        {member.phone as string}
                      </a>
                      <a
                        href={`mailto:${member.email as string}`}
                        className="flex items-center gap-2.5 text-[#6B7280] text-sm hover:text-[#C5A55A] transition-colors truncate"
                      >
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        {member.email as string}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Work With Our Team?
          </h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">
            Our experts are ready to help you achieve your real estate goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-9 py-4 rounded-full hover:bg-[#D4BA7A] transition-colors"
          >
            Contact Our Team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
