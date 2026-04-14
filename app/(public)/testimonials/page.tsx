import { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Client Testimonials — What Our Clients Say",
  description:
    "Read what Leo Realty's clients say about their experience buying, selling, renting, and financing through our South Florida brokerage.",
};

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tenant",
    text: "Leo Realty made finding my apartment incredibly easy. They understood exactly what I was looking for and had me in my new place within two weeks. The entire team was professional, responsive, and genuinely cared about finding me the right fit. I've recommended them to everyone I know.",
    rating: 5,
    category: "Renting",
    date: "January 2024",
  },
  {
    id: 2,
    name: "Michael Smith",
    role: "First-Time Homebuyer",
    text: "As a first-time homebuyer, I was nervous and didn't know where to start. The team at Leo Realty walked me through everything from pre-approval to closing day. Their MR 2% commission model saved me thousands compared to other brokerages. I couldn't be happier with my new home!",
    rating: 5,
    category: "Buying",
    date: "March 2024",
  },
  {
    id: 3,
    name: "David Lee",
    role: "Business Owner",
    text: "I needed a commercial space that fit my budget and my business's growth plans. Leo Realty Capital Investments not only found the perfect location but also helped me secure favorable lease terms. Their 32 years of experience really shows — they knew exactly what to look for.",
    rating: 5,
    category: "Commercial",
    date: "November 2023",
  },
  {
    id: 4,
    name: "Emily Chen",
    role: "Real Estate Investor",
    text: "The DSCR loan program through Leo Realty was exactly what I needed to expand my rental portfolio without the hassle of documenting personal income. Olivier was incredibly knowledgeable about investment financing and made the entire process seamless. I've since purchased two more properties.",
    rating: 5,
    category: "Investment",
    date: "February 2024",
  },
  {
    id: 5,
    name: "James Thompson",
    role: "Property Owner",
    text: "I had tried to sell my home with two other agents before finding Leo Realty. Within 21 days of listing with them, we had an offer at asking price. Leopold's market knowledge and negotiation skills are simply unmatched. Leo Realty is the gold standard in South Florida real estate.",
    rating: 5,
    category: "Selling",
    date: "April 2024",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">Client Stories</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-6">
            What Our Clients{" "}
            <span className="text-[#C5A55A]">Say About Us</span>
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-[#C5A55A] text-[#C5A55A]" />
              ))}
            </div>
            <span className="text-white/55 text-sm">5.0 average from 100+ reviews</span>
          </div>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Over 32 years, thousands of families have trusted Leo Realty for
            their most important real estate decisions.
          </p>
        </div>
      </section>

      {/* Testimonials — editorial large text */}
      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`relative bg-white border border-[#E8E4DE] rounded-2xl p-10 md:p-12 hover:border-[#C5A55A]/30 transition-colors duration-300 ${
                  i === 0 ? "lg:grid lg:grid-cols-5 lg:gap-12" : ""
                }`}
              >
                {/* Large quote number */}
                <div className="absolute top-6 right-8 font-playfair text-[8rem] leading-none text-[#C5A55A]/8 select-none pointer-events-none font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className={i === 0 ? "lg:col-span-3" : ""}>
                  {/* Category tag */}
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-[#C5A55A] mb-5">
                    {t.category}
                  </span>

                  {/* Quote — large editorial */}
                  <p className="font-playfair text-[#1A1A1A] text-xl md:text-2xl leading-relaxed italic mb-8">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Attribution */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <span className="font-playfair text-[#C5A55A] font-bold text-lg">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#0A1628] text-sm">{t.name}</div>
                      <div className="text-[#6B7280] text-xs">{t.role} · {t.date}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-[#C5A55A] text-[#C5A55A]" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* First testimonial decorative element */}
                {i === 0 && (
                  <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
                    <div className="text-center p-8 bg-[#0A1628] rounded-2xl w-full">
                      <div className="font-playfair text-5xl font-bold text-[#C5A55A] mb-2">5.0</div>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-5 h-5 fill-[#C5A55A] text-[#C5A55A]" />
                        ))}
                      </div>
                      <div className="text-white/50 text-sm">Average client rating</div>
                      <div className="text-white/30 text-xs mt-1">100+ reviews</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">
            Join thousands of satisfied clients. Contact Leo Realty today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-9 py-4 rounded-full hover:bg-[#D4BA7A] transition-colors"
          >
            Get Started Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
