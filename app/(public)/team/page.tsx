import { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, Globe, ArrowRight } from "lucide-react";
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
  { id: 1, slug: "leopold-evariste", name: "Leopold Evariste", title: "CEO & Founder", role: "ceo", phone: "(305) 705-2030", email: "leopold@leorealty.com", bio: "Leopold Evariste founded Leo Realty Capital Investments in 1992 with a mission to transform the South Florida real estate experience. His pioneering MR 2% commission model has saved clients millions while delivering white-glove service. With over 32 years of market expertise, Leopold has navigated every cycle of the South Florida market and built a reputation as one of the region's most trusted brokers.", avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", specialties: ["Luxury Properties", "Investment Properties", "Commercial Real Estate", "1031 Exchanges"], yearsExperience: 32, isActive: true, displayOrder: 0, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 2, slug: "joanne-evariste", name: "Joanne Evariste", title: "Office Manager", role: "office_manager", phone: "(305) 705-2030", email: "joanne@leorealty.com", bio: "Joanne Evariste is the backbone of Leo Realty's operations. With meticulous attention to detail and a warm, client-first approach, she ensures every transaction runs smoothly. Joanne coordinates between agents, clients, lenders, and closing attorneys to deliver a seamless experience.", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", specialties: ["Operations", "Client Relations", "Transaction Coordination"], yearsExperience: 15, isActive: true, displayOrder: 1, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 3, slug: "jean-samuel-luxama", name: "Jean Samuel Luxama", title: "Realtor & Loan Originator", role: "realtor", phone: "(305) 705-2030", email: "jsluxama@leorealty.com", bio: "Dual-licensed as both a Realtor and Loan Originator, Jean Samuel provides a uniquely seamless experience — helping clients find their perfect property AND securing the best financing. His comprehensive approach saves clients time, money, and stress.", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80", specialties: ["Residential Real Estate", "FHA Loans", "First-Time Buyers", "Hometown Heroes"], yearsExperience: 8, isActive: true, displayOrder: 2, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 4, slug: "olivier-desire", name: "Olivier Desire", title: "Loan Originator", role: "loan_originator", phone: "(305) 705-2030", email: "olivier@leorealty.com", bio: "Olivier Desire specializes in investment property financing and complex mortgage scenarios. His expertise in DSCR loans, USDA programs, and conventional financing makes him an invaluable resource for both first-time buyers and seasoned investors.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", specialties: ["DSCR Loans", "USDA Loans", "Conventional Financing", "Investment Properties"], yearsExperience: 10, isActive: true, displayOrder: 3, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 5, slug: "daniel-calixte", name: "Daniel Calixte", title: "Loan Originator", role: "loan_originator", phone: "(305) 705-2030", email: "daniel@leorealty.com", bio: "Daniel Calixte is known for his deep knowledge of VA and FHA loan programs and his dedication to making the mortgage process stress-free. He takes time to educate clients about their options, ensuring they make informed decisions that align with their long-term goals.", avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80", specialties: ["VA Loans", "FHA Loans", "Refinancing", "Credit Improvement"], yearsExperience: 7, isActive: true, displayOrder: 4, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
  { id: 6, slug: "carly-cadet", name: "Carly Cadet", title: "Realtor Associate", role: "realtor_associate", phone: "(305) 705-2030", email: "carly@leorealty.com", bio: "Carly Cadet brings energy, market knowledge, and a genuine passion for real estate to every client relationship. Specializing in residential homes and condominiums throughout Miami-Dade County, she has a talent for matching clients with properties that truly feel like home.", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", specialties: ["Residential Homes", "Condominiums", "First-Time Buyers", "Rentals"], yearsExperience: 5, isActive: true, displayOrder: 5, licenseNumber: null, instagramUrl: null, linkedinUrl: null, facebookUrl: null },
];

export default async function TeamPage() {
  const dbTeam = await getTeam();
  const team = dbTeam.length > 0 ? dbTeam : TEAM_DATA;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <span className="text-[#C5A55A] text-sm font-medium">Our Team</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-[var(--font-playfair)] mb-6">
            Meet Your{" "}
            <span className="text-[#C5A55A]">Expert Team</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            Six dedicated real estate professionals — licensed realtors, loan originators,
            and support staff — all committed to delivering exceptional results.
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-72 overflow-hidden bg-[#0A1628]/5">
                  {member.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#162447]">
                      <span className="text-white text-6xl font-[var(--font-playfair)]">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="text-white font-bold text-xl font-[var(--font-playfair)]">
                      {member.name}
                    </div>
                    <div className="text-[#C5A55A] text-sm font-medium">{member.title}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Specialties */}
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(member.specialties as string[]).slice(0, 3).map((s) => (
                        <span key={s} className="bg-[#0A1628]/5 text-[#0A1628] text-xs font-medium px-3 py-1 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {member.yearsExperience > 0 && (
                    <div className="text-[#C5A55A] text-sm font-medium mb-5">
                      {member.yearsExperience}+ Years Experience
                    </div>
                  )}

                  {/* Contact */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#C5A55A] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#C5A55A] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  </div>

                  {/* Social */}
                  {(member.linkedinUrl || member.instagramUrl || member.facebookUrl) && (
                    <div className="flex gap-3 mt-4">
                      {member.linkedinUrl && (
                        <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C5A55A] transition-colors">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {member.instagramUrl && (
                        <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C5A55A] transition-colors">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {member.facebookUrl && (
                        <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C5A55A] transition-colors">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join team CTA */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white font-[var(--font-playfair)] mb-4">
            Ready to Work With Our Team?
          </h2>
          <p className="text-white/60 mb-8">
            Our experts are ready to help you achieve your real estate goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold px-8 py-4 rounded-full hover:bg-[#D4B96A] transition-colors"
          >
            Contact Our Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
