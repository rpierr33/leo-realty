"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LanguageSwitcher");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const switchTo = (next: string) => {
    setOpen(false);
    router.replace(pathname, { locale: next });
  };

  const displayCode = (loc: string) =>
    loc === "ht" ? "KR" : loc.toUpperCase();

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-white/85 hover:text-[#C5A55A] transition-colors rounded"
        aria-label={t("label")}
      >
        <Globe className="w-4 h-4" />
        <span>{displayCode(locale)}</span>
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform",
            open ? "rotate-180" : ""
          )}
        />
      </button>
      {open && (
        <div className="absolute top-full right-0 w-36 bg-[#0A1628] border border-white/8 rounded-xl shadow-2xl shadow-black/40 py-1.5 z-50 mt-1">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => switchTo(loc)}
              className={cn(
                "block w-full text-left px-4 py-2 text-sm transition-colors",
                loc === locale
                  ? "text-[#C5A55A] bg-white/4"
                  : "text-white/75 hover:text-[#C5A55A] hover:bg-white/4"
              )}
            >
              {t(loc as "en" | "fr" | "ht")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
