import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
  /** Current search params — every href preserves the active filters. */
  params: Record<string, string | undefined>;
  /** Set when the feed's $skip ceiling hides deeper results (see MLS_MAX_SKIP). */
  deepCapReached?: boolean;
  maxReachable?: number;
};

function pageHref(params: Record<string, string | undefined>, page: number): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && k !== "page") qs.set(k, v);
  }
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `/properties?${s}` : "/properties";
}

/** 1 … c-2 c-1 [c] c+1 c+2 … N — null marks an ellipsis gap. */
function pageWindow(current: number, total: number): Array<number | null> {
  const wanted = new Set([1, 2, current - 2, current - 1, current, current + 1, current + 2, total - 1, total]);
  const list = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: Array<number | null> = [];
  let prev = 0;
  for (const p of list) {
    if (p - prev > 1) out.push(null);
    out.push(p);
    prev = p;
  }
  return out;
}

export default async function PropertiesPagination({
  currentPage,
  totalPages,
  params,
  deepCapReached,
  maxReachable,
}: Props) {
  if (totalPages <= 1) return null;
  const t = await getTranslations("PropertiesPage");

  const chip =
    "inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-full text-sm font-semibold transition-colors";
  const idle = `${chip} bg-white border border-[#E8E4DE] text-[#0A1628] hover:border-[#C5A55A]/50 hover:text-[#C5A55A]`;
  const active = `${chip} bg-[#0A1628] text-[#C5A55A] border border-[#0A1628]`;
  const disabled = `${chip} bg-white border border-[#E8E4DE] text-[#6B7280]/40 cursor-not-allowed`;

  return (
    <nav aria-label={t("paginationPageOf", { page: currentPage, total: totalPages })} className="mt-10">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage > 1 ? (
          <Link href={pageHref(params, currentPage - 1)} className={idle} rel="prev">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">{t("paginationPrevious")}</span>
          </Link>
        ) : (
          <span className={disabled} aria-disabled="true">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">{t("paginationPrevious")}</span>
          </span>
        )}

        {pageWindow(currentPage, totalPages).map((p, i) =>
          p === null ? (
            <span key={`gap-${i}`} className="px-1 text-[#6B7280]/60 select-none">
              …
            </span>
          ) : p === currentPage ? (
            <span key={p} className={active} aria-current="page">
              {p.toLocaleString()}
            </span>
          ) : (
            <Link key={p} href={pageHref(params, p)} className={idle}>
              {p.toLocaleString()}
            </Link>
          )
        )}

        {currentPage < totalPages ? (
          <Link href={pageHref(params, currentPage + 1)} className={idle} rel="next">
            <span className="hidden sm:inline mr-1">{t("paginationNext")}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className={disabled} aria-disabled="true">
            <span className="hidden sm:inline mr-1">{t("paginationNext")}</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>

      <div className="mt-3 text-center text-xs text-[#6B7280]">
        {t("paginationPageOf", { page: currentPage, total: totalPages })}
      </div>

      {deepCapReached && maxReachable ? (
        <p className="mt-2 text-center text-xs text-[#6B7280]/80">
          {t("paginationRefine", { max: maxReachable.toLocaleString() })}
        </p>
      ) : null}
    </nav>
  );
}
