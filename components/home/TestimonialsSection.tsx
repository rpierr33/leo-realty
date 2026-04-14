"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tenant",
    text: "Leo Realty made finding my apartment incredibly easy. They understood exactly what I was looking for and had me in my new place within two weeks. Truly professional service!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: 2,
    name: "Michael Smith",
    role: "First-Time Homebuyer",
    text: "As a first-time homebuyer, I was nervous about the process. The team at Leo Realty walked me through everything. Their MR 2% commission saved me thousands. Couldn't be happier!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 3,
    name: "David Lee",
    role: "Business Owner",
    text: "I needed a commercial property that fit my budget and growth plans. Leo Realty Capital Investments found the perfect location. Their 32 years of experience really shows.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
  },
  {
    id: 4,
    name: "Emily Chen",
    role: "Real Estate Investor",
    text: "The DSCR loan program through Leo Realty was exactly what I needed to expand my rental portfolio. Olivier was knowledgeable, fast, and made the process seamless.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
  },
  {
    id: 5,
    name: "James Thompson",
    role: "Property Owner",
    text: "Sold my home in just 21 days at asking price. Leopold's market knowledge and negotiation skills are unmatched. Leo Realty is the gold standard in South Florida real estate.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0A1628] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/30 rounded-full px-4 py-1.5 mb-4"
          >
            <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">
              Client Stories
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white font-[var(--font-playfair)] mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Over 32 years of helping South Florida families. Here are some of their stories.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors"
            >
              <Quote className="w-8 h-8 text-[#C5A55A] mb-4" />
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#C5A55A] fill-[#C5A55A]" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/50 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
          {testimonials.slice(3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 3) * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors"
            >
              <Quote className="w-8 h-8 text-[#C5A55A] mb-4" />
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#C5A55A] fill-[#C5A55A]" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/50 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
