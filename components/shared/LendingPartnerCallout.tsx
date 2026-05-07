import { useTranslations } from "next-intl";

interface Props {
  variant?: "default" | "compact" | "dark";
}

export default function LendingPartnerCallout({ variant = "default" }: Props) {
  const t = useTranslations("LendingCallout");
  const isDark = variant === "dark";
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <p className={`text-xs ${isDark ? "text-white/45" : "text-[#6B7280]"} leading-relaxed`}>
        {t("compactPrefix")}{" "}
        <a href="https://klemortgage.com" target="_blank" rel="noopener noreferrer" className="text-[#C5A55A] underline hover:no-underline">
          KLE Mortgage Financing, LLC
        </a>{" "}
        {t("compactSuffix")}
      </p>
    );
  }

  return (
    <div className={`rounded-xl border px-5 py-4 ${isDark ? "border-white/10 bg-white/5" : "border-[#C5A55A]/25 bg-[#FAF8F5]"}`}>
      <div className="flex items-start gap-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C5A55A]">
          {t("defaultLabel")}
        </div>
      </div>
      <p className={`text-sm leading-relaxed mt-2 ${isDark ? "text-white/65" : "text-[#374151]"}`}>
        {t("defaultPrefix")}{" "}
        <a
          href="https://klemortgage.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold underline hover:no-underline ${isDark ? "text-white" : "text-[#0A1628]"}`}
        >
          KLE Mortgage Financing, LLC
        </a>
        {" "}{t("defaultSuffix")}
      </p>
    </div>
  );
}
