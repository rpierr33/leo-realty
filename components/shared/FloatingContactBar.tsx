"use client";

import { Phone, Search, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function FloatingContactBar() {
  const t = useTranslations("FloatingContactBar");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div
        className="flex items-stretch border-t border-white/10"
        style={{
          background: "rgba(7, 16, 31, 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <a
          href="tel:+13057052030"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white/80 active:bg-white/10 transition-colors"
          aria-label={t("ariaCall")}
        >
          <Phone className="w-5 h-5 text-[#C5A55A]" />
          <span className="text-[10px] font-semibold tracking-wide uppercase text-white/70">
            {t("callNow")}
          </span>
        </a>

        <div className="w-px bg-white/10 my-2" />

        <Link
          href="/properties"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white/80 active:bg-white/10 transition-colors"
          aria-label={t("ariaFind")}
        >
          <Search className="w-5 h-5 text-[#C5A55A]" />
          <span className="text-[10px] font-semibold tracking-wide uppercase text-white/70">
            {t("findProperty")}
          </span>
        </Link>

        <div className="w-px bg-white/10 my-2" />

        <Link
          href="/contact"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-white/80 active:bg-white/10 transition-colors"
          aria-label={t("ariaContact")}
        >
          <MessageSquare className="w-5 h-5 text-[#C5A55A]" />
          <span className="text-[10px] font-semibold tracking-wide uppercase text-white/70">
            {t("contact")}
          </span>
        </Link>
      </div>

      <div
        className="bg-[#07101F]"
        style={{ height: "env(safe-area-inset-bottom, 0px)" }}
      />
    </div>
  );
}
