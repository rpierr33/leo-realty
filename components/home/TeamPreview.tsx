import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
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
      .limit(4);
  } catch {
    return [];
  }
}

const FALLBACK_TEAM = [
  {
    id: 1,
    name: "Leopold Evariste",
    title: "CEO & Founder",
    role: "ceo" as const,
    phone: "(305) 705-2030",
    email: "leopold@leorealty.com",
    bio: "With over 32 years in South Florida real estate, Leopold has helped thousands of families achieve homeownership.",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80",
    specialties: ["Luxury Homes", "Investment Properties"],
    yearsExperience: 32,
    licenseNumber: null,
    instagramUrl: null,
    linkedinUrl: null,
    facebookUrl: null,
    isActive: true,
    displayOrder: 0,
    slug: "leopold-evariste",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Jean Samuel Luxama",
    title: "Realtor & Loan Originator",
    role: "realtor" as const,
    phone: "(305) 705-2030",
    email: "jsluxama@leorealty.com",
    bio: "Dual-licensed as both a Realtor and Loan Originator, Jean Samuel provides seamless service from property search to financing.",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80",
    specialties: ["Residential", "Mortgages"],
    yearsExperience: 8,
    licenseNumber: null,
    instagramUrl: null,
    linkedinUrl: null,
    facebookUrl: null,
    isActive: true,
    displayOrder: 2,
    slug: "jean-samuel-luxama",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function TeamPreview() {
  const team = await getTeamMembers();
  const displayTeam = team.length > 0 ? team.slice(0, 4) : FALLBACK_TEAM;

  return (
    <section className="py-24 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">
                Our Team
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628] font-[var(--font-playfair)]">
              Expert Professionals
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg">
              A dedicated team of licensed realtors and loan originators committed
              to making your real estate journey exceptional.
            </p>
          </div>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-[#C5A55A] font-semibold hover:gap-3 transition-all"
          >
            Meet The Full Team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTeam.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-56 bg-[#0A1628]/5 overflow-hidden">
                {member.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#162447]">
                    <span className="text-white text-5xl font-[var(--font-playfair)]">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] text-lg">
                  {member.name}
                </h3>
                <p className="text-[#C5A55A] text-sm font-medium mb-3">{member.title}</p>
                <div className="space-y-2">
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#C5A55A] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {member.phone}
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#C5A55A] transition-colors truncate"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {member.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
