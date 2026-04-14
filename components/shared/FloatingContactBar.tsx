"use client";

import { Phone, Search, MessageSquare } from "lucide-react";
import Link from "next/link";

/**
 * FloatingContactBar — sticky bottom mobile CTA bar.
 * Hidden on md+ screens (md:hidden). Glassmorphism background.
 * Phone: (305) 705-2030
 */
export default function FloatingContactBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphism bar */}
      <div
        className="flex items-stretch border-t border-white/10"
        style={{
          background: "rgba(7, 16, 31, 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Call Now */}
        <a
          href="tel:+13057052030"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white/80 active:bg-white/10 transition-colors"
          aria-label="Call Leo Realty"
        >
          <Phone className="w-5 h-5 text-[#C5A55A]" />
          <span className="text-[10px] font-semibold tracking-wide uppercase text-white/70">
            Call Now
          </span>
        </a>

        {/* Divider */}
        <div className="w-px bg-white/10 my-2" />

        {/* Find Property */}
        <Link
          href="/properties"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white/80 active:bg-white/10 transition-colors"
          aria-label="Find a property"
        >
          <Search className="w-5 h-5 text-[#C5A55A]" />
          <span className="text-[10px] font-semibold tracking-wide uppercase text-white/70">
            Find Property
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px bg-white/10 my-2" />

        {/* Contact */}
        <Link
          href="/contact"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white/80 active:bg-white/10 transition-colors"
          aria-label="Contact us"
        >
          <MessageSquare className="w-5 h-5 text-[#C5A55A]" />
          <span className="text-[10px] font-semibold tracking-wide uppercase text-white/70">
            Contact
          </span>
        </Link>
      </div>

      {/* Safe area spacer for iOS */}
      <div
        className="bg-[#07101F]"
        style={{ height: "env(safe-area-inset-bottom, 0px)" }}
      />
    </div>
  );
}
