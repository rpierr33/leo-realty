import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  { id: 1, name: "Leopold Evariste", title: "CEO & Founder", avatarUrl: "/team-leopold.jpg" },
  { id: 2, name: "Joanne Evariste", title: "Office Manager", avatarUrl: "/team-joanne.jpg" },
  { id: 3, name: "Jean Samuel Luxama", title: "Realtor & Loan Originator", avatarUrl: "/team-jean-samuel.jpg" },
  { id: 4, name: "Olivier Desire", title: "Loan Originator", avatarUrl: "/team-olivier.jpg" },
  { id: 5, name: "Daniel Calixte", title: "Loan Originator", avatarUrl: "/team-daniel.jpg" },
  { id: 6, name: "Carly Cadet", title: "Realtor Associate", avatarUrl: "/team-carly.jpg" },
];

const values = [
  { title: "Excellence", description: "32 years of consistently delivering exceptional results for every client we serve." },
  { title: "Integrity", description: "Transparent communication and honest guidance throughout every transaction." },
  { title: "Community", description: "Deep roots in South Florida — we genuinely care about the communities we serve." },
  { title: "Teamwork", description: "A dedicated team working together to achieve your real estate goals." },
];

export default async function AboutPage() {
  const team = await getTeam();
  const displayTeam = team.length > 0 ? team : FALLBACK_TEAM;

  return (
    <>
      {/* Hero — full bleed dark */}
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/90 to-[#0A1628]/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">About Us</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6 max-w-3xl">
            32 Years of{" "}
            <span className="text-[#C5A55A]">Trusted Excellence</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Leo Realty Capital Investments has been South Florida&apos;s trusted real estate
            brokerage since 1992 — helping thousands of families buy, sell, rent, and finance
            their dream homes.
          </p>
        </div>
      </section>

      {/* Story — editorial two-col */}
      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.75rem)] font-bold text-[#0A1628] mb-8 leading-tight">
                From Vision to South Florida&apos;s
                <br />
                Most Trusted Name
              </h2>
              <div className="space-y-5 text-[#6B7280] leading-relaxed text-[15px]">
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
                  Our &ldquo;MR 2%&rdquo; commission model represents our commitment to giving clients
                  maximum value — keeping more money in your pocket while delivering
                  white-glove service every step of the way.
                </p>
              </div>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 mt-10 bg-[#0A1628] text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-[#152238] transition-colors"
              >
                Start a Conversation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=85"
                  alt="Leo Realty Office — South Florida"
                  width={700}
                  height={500}
                  className="w-full h-[480px] object-cover"
                />
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-6 -right-4 md:right-0 bg-[#C5A55A] text-[#0A1628] px-6 py-5 rounded-2xl shadow-2xl">
                <div className="font-playfair text-4xl font-bold leading-none">32+</div>
                <div className="text-[#0A1628]/70 text-xs font-semibold mt-1 uppercase tracking-wide">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision — dark panels */}
      <section className="py-24 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#152238] border border-white/6 rounded-2xl p-10">
              <div className="text-[#C5A55A] text-[10px] font-bold uppercase tracking-[0.18em] mb-4">Our Mission</div>
              <h3 className="font-playfair text-3xl font-bold text-white mb-5">Making Dreams Real</h3>
              <p className="text-white/55 leading-relaxed">
                Our mission is to make real estate transactions smooth, transparent, and
                rewarding. We achieve this through expert guidance, honest communication,
                and a genuine commitment to each client&apos;s unique goals.
              </p>
            </div>
            <div className="bg-[#C5A55A] rounded-2xl p-10">
              <div className="text-[#0A1628]/60 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">Our Vision</div>
              <h3 className="font-playfair text-3xl font-bold text-[#0A1628] mb-5">No One Does It Better</h3>
              <p className="text-[#0A1628]/70 leading-relaxed">
                To be South Florida&apos;s most trusted and respected real estate brokerage —
                known for integrity, expertise, and delivering outstanding results for
                buyers, sellers, renters, and investors alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values — clean grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-label justify-center">Our Values</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-[#0A1628]">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={value.title} className="text-center p-8 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DE] hover:border-[#C5A55A]/30 transition-colors">
                <div className="font-playfair text-5xl font-bold text-[#C5A55A]/20 mb-4 leading-none">
                  0{i + 1}
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#0A1628] mb-3">{value.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Spotlight — editorial */}
      <section className="py-24 md:py-32 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Portrait */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden h-[480px]">
                <Image
                  src="/team-leopold.jpg"
                  alt="Leopold Evariste — CEO & Founder"
                  width={600}
                  height={480}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#C5A55A] px-5 py-4 rounded-xl">
                <div className="font-playfair text-2xl font-bold text-[#0A1628] leading-none">32+</div>
                <div className="text-[#0A1628]/60 text-[10px] font-bold uppercase tracking-wide mt-1">Years Leading</div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="section-label">Founder & CEO</span>
              <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-2 leading-tight">
                Leopold Evariste
              </h2>
              <p className="text-[#C5A55A] font-semibold text-sm mb-8 tracking-wide">
                CEO & Founder · 32+ Years Experience
              </p>
              <div className="space-y-4 text-white/55 leading-relaxed text-[15px]">
                <p>
                  Leopold Evariste founded Leo Realty Capital Investments with a clear purpose:
                  to provide South Florida families with expert, honest real estate guidance
                  at a fair price.
                </p>
                <p>
                  His pioneering &ldquo;MR 2%&rdquo; commission model disrupted the industry while
                  his deep market knowledge and personalized approach built a loyal client
                  base spanning three decades.
                </p>
                <p>
                  Today, Leopold leads a team of six dedicated professionals — realtors,
                  loan originators, and support staff — continuing his mission to make
                  every client&apos;s real estate dream a reality.
                </p>
              </div>
              <div className="flex gap-4 mt-10">
                <a
                  href="tel:+13057052030"
                  className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-7 py-3.5 rounded-full hover:bg-[#D4BA7A] transition-colors"
                >
                  Contact Leopold
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team preview */}
      <section className="py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="section-label">Our Team</span>
              <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.75rem)] font-bold text-[#0A1628] leading-tight">
                Meet Our Professionals
              </h2>
            </div>
            <Link
              href="/team"
              className="group inline-flex items-center gap-2 text-[#0A1628] font-semibold text-sm hover:text-[#C5A55A] transition-colors"
            >
              Full Team Page
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {displayTeam.map((member) => {
              const photo = (member.avatarUrl as string)?.startsWith("/") ? member.avatarUrl as string : null;
              const external = !photo && (member.avatarUrl as string) ? member.avatarUrl as string : null;
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

      {/* CTA */}
      <section className="py-16 bg-[#C5A55A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">
            Ready to Start Your Real Estate Journey?
          </h2>
          <p className="text-[#0A1628]/65 mb-8 max-w-xl mx-auto">
            Contact Leo Realty today for a free consultation with one of our experts.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-bold text-sm px-9 py-4 rounded-full hover:bg-[#152238] transition-colors shadow-xl shadow-[#0A1628]/30"
          >
            Get a Free Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
