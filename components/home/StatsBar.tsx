"use client";

import { motion } from "framer-motion";
import { TrendingUp, Home, Users, Award } from "lucide-react";

const stats = [
  { icon: Award, value: "32+", label: "Years of Excellence" },
  { icon: Home, value: "1,000+", label: "Homes Closed" },
  { icon: Users, value: "6", label: "Expert Professionals" },
  { icon: TrendingUp, value: "MR 2%", label: "Commission Rate" },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-b border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A1628]/5 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-6 h-6 text-[#C5A55A]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0A1628] font-[var(--font-playfair)]">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
