import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Target, Heart, Users, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "About Us — 32 Years of Real Estate Excellence",
  description:
    "Learn about Leo Realty Capital Investments — founded by Leopold Evariste with over 32 years of South Florida real estate expertise.",
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

const FALLBACK_TEAM = [
  { id: 1, name: "Leopold Evariste", title: "CEO & Founder", role: "ceo", avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80", bio: "32+ years leading Leo Realty Capital Investments.", phone: "(305) 705-2030", email: "leopold@leorealty.com", specialties: ["Luxury", "Investment"], yearsExperience: 32, isActive: true, displayOrder: 0 },
  { id: 2, name: "Joanne Evariste", title: "Office Manager", role: "office_manager", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80", bio: "Keeps Leo Realty operations running seamlessly.", phone: "(305) 705-2030", email: "joanne@leorealty.com", specialties: ["Operations"], yearsExperience: 15, isActive: true, displayOrder: 1 },
];

const values = [
  { icon: Award, title: "Excellence", description: "32 years of consistently delivering exceptional results for our clients." },
  { icon: Target, title: "Integrity", description: "Transparent communication and honest guidance throughout every transaction." },
  { icon: Heart, title: "Community", description: "Deep roots in South Florida — we care about the communities we serve." },
  { icon: Users, title: "Teamwork", description: "A dedicated team working together to achieve your real estate goals." },
];

export default async function AboutPage() {
  const team = await getTeam();
  const displayTeam = team.length > 0 ? team : FALLBACK_TEAM;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <span className="text-[#C5A55A] text-sm font-medium">About Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-[var(--font-playfair)] mb-6">
            32 Years of{" "}
            <span className="text-[#C5A55A]">Trusted Excellence</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            Leo Realty Capital Investments has been South Florida&apos;s trusted real estate
            brokerage since 1992 — helping thousands of families buy, sell, rent, and finance
            their dream homes.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">Our Story</span>
              </div>
              <h2 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-6">
                From Vision to South Florida&apos;s Most Trusted Name
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded by Leopold Evariste in 1992, Leo Realty Capital Investments began
                  with a simple but powerful mission: to make real estate transactions smooth,
                  transparent, and rewarding for every client.
                </p>
                <p>
                  Over more than three decades, Leo Realty has grown from a small brokerage to
                  a full-service real estate and mortgage company with a team of six dedicated
                  professionals. We&apos;ve closed over 1,000 transactions and helped countless
                  South Florida families achieve homeownership.
                </p>
                <p>
                  Our &quot;MR 2%&quot; commission model represents our commitment to giving clients
                  maximum value — keeping more money in your pocket while delivering
                  white-glove service every step of the way.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden h-96">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                  alt="Leo Realty Office"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#C5A55A] text-[#0A1628] p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold font-[var(--font-playfair)]">32+</div>
                <div className="text-sm font-semibold">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0A1628] rounded-3xl p-10">
              <div className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider mb-4">Our Mission</div>
              <h3 className="text-3xl font-bold text-white font-[var(--font-playfair)] mb-4">
                Making Dreams Real
              </h3>
              <p className="text-white/70 leading-relaxed">
                Our mission is to make real estate transactions smooth, transparent, and
                rewarding. We achieve this through expert guidance, honest communication,
                and a genuine commitment to each client&apos;s unique goals and circumstances.
              </p>
            </div>
            <div className="bg-[#C5A55A] rounded-3xl p-10">
              <div className="text-[#0A1628] text-sm font-semibold uppercase tracking-wider mb-4">Our Vision</div>
              <h3 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">
                No One Does It Better
              </h3>
              <p className="text-[#0A1628]/80 leading-relaxed">
                To be South Florida&apos;s most trusted and respected real estate brokerage —
                known for integrity, expertise, and delivering outstanding results for
                buyers, sellers, renters, and investors alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">Our Values</span>
            </div>
            <h2 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)]">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-[#F8F7F4] rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#0A1628] flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-[#C5A55A]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Spotlight */}
      <section className="py-24 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden h-96">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
                  alt="Leopold Evariste — CEO"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
                <span className="text-[#C5A55A] text-sm font-medium">CEO Spotlight</span>
              </div>
              <h2 className="text-4xl font-bold text-white font-[var(--font-playfair)] mb-4">
                Leopold Evariste
              </h2>
              <p className="text-[#C5A55A] font-semibold mb-6">Founder & CEO · 32+ Years Experience</p>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Leopold Evariste founded Leo Realty Capital Investments with a clear purpose:
                  to provide South Florida families with expert, honest real estate guidance
                  at a fair price.
                </p>
                <p>
                  His pioneering &quot;MR 2%&quot; commission model disrupted the industry while
                  his deep market knowledge and personalized approach built a loyal client
                  base spanning three decades.
                </p>
                <p>
                  Today, Leopold leads a team of six dedicated professionals — realtors,
                  loan originators, and support staff — continuing his mission to make
                  every client&apos;s real estate dream a reality.
                </p>
              </div>
              <div className="flex gap-4 mt-8">
                <a
                  href="tel:+13057052030"
                  className="bg-[#C5A55A] text-[#0A1628] font-bold px-6 py-3 rounded-full hover:bg-[#D4B96A] transition-colors"
                >
                  Contact Leopold
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">Our Team</span>
              </div>
              <h2 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)]">
                Meet Our Professionals
              </h2>
            </div>
            <Link href="/team" className="inline-flex items-center gap-2 text-[#C5A55A] font-semibold">
              Full Team Page <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayTeam.map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-[#0A1628]/10 mx-auto mb-3">
                  {member.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0A1628]">
                      <span className="text-white text-2xl font-[var(--font-playfair)]">{member.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="text-[#0A1628] font-semibold text-sm">{member.name}</div>
                <div className="text-gray-400 text-xs">{member.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">
            Ready to Start Your Real Estate Journey?
          </h2>
          <p className="text-[#0A1628]/70 mb-8 max-w-xl mx-auto">
            Contact Leo Realty today for a free consultation with one of our experts.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold px-8 py-4 rounded-full hover:bg-[#162447] transition-colors"
          >
            Get a Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
