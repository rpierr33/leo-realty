import { Metadata } from "next";
import Link from "next/link";
import { Star, Quote, ArrowRight } from "lucide-react";

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
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    category: "Renting",
    date: "January 2024",
  },
  {
    id: 2,
    name: "Michael Smith",
    role: "First-Time Homebuyer",
    text: "As a first-time homebuyer, I was nervous and didn't know where to start. The team at Leo Realty walked me through everything from pre-approval to closing day. Their MR 2% commission model saved me thousands compared to other brokerages. I couldn't be happier with my new home!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    category: "Buying",
    date: "March 2024",
  },
  {
    id: 3,
    name: "David Lee",
    role: "Business Owner",
    text: "I needed a commercial space that fit my budget and my business's growth plans. Leo Realty Capital Investments not only found the perfect location but also helped me secure favorable lease terms. Their 32 years of experience really shows — they knew exactly what to look for and what to avoid.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    category: "Commercial",
    date: "November 2023",
  },
  {
    id: 4,
    name: "Emily Chen",
    role: "Real Estate Investor",
    text: "The DSCR loan program through Leo Realty was exactly what I needed to expand my rental portfolio without the hassle of documenting personal income. Olivier was incredibly knowledgeable about investment financing and made the entire process seamless. I've since purchased two more properties through Leo Realty.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    category: "Investment",
    date: "February 2024",
  },
  {
    id: 5,
    name: "James Thompson",
    role: "Property Owner",
    text: "I had tried to sell my home with two other agents before finding Leo Realty. Within 21 days of listing with them, we had an offer at asking price. Leopold's market knowledge and negotiation skills are simply unmatched. Leo Realty is the gold standard in South Florida real estate.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    category: "Selling",
    date: "April 2024",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <span className="text-[#C5A55A] text-sm font-medium">Client Stories</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-[var(--font-playfair)] mb-6">
            What Our Clients{" "}
            <span className="text-[#C5A55A]">Say About Us</span>
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-5 h-5 text-[#C5A55A] fill-[#C5A55A]" />
              ))}
            </div>
            <span className="text-white/70">5.0 average from 100+ reviews</span>
          </div>
          <p className="text-white/70 text-xl max-w-2xl">
            Over 32 years, thousands of families have trusted Leo Realty for
            their most important real estate decisions. Here are some of their stories.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-6">
                  <Quote className="w-10 h-10 text-[#C5A55A]" />
                  <span className="bg-[#0A1628]/5 text-[#0A1628] text-xs font-semibold px-3 py-1 rounded-full">
                    {t.category}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-[#0A1628]">{t.name}</div>
                      <div className="text-gray-400 text-sm">{t.role}</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#C5A55A] fill-[#C5A55A]" />
                      ))}
                    </div>
                    <div className="text-gray-400 text-xs text-right">{t.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A1628]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white font-[var(--font-playfair)] mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-white/60 mb-8">
            Join thousands of satisfied clients. Contact Leo Realty today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold px-8 py-4 rounded-full hover:bg-[#D4B96A] transition-colors"
          >
            Get Started Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
