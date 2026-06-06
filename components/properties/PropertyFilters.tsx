"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Waves, Car, Droplets, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type FilterParams = {
  type?: string;
  status?: string;
  price_min?: string;
  price_max?: string;
  beds?: string;
  baths?: string;
  sqft_min?: string;
  year_min?: string;
  pool?: string;
  waterfront?: string;
  garage?: string;
  include_pending?: string;
  city?: string;
  sort?: string;
  q?: string;
};

const STATUSES = [
  { value: "for_sale", labelKey: "statusForSale" as const },
  { value: "for_rent", labelKey: "statusForRent" as const },
  { value: "pending", labelKey: "statusPending" as const },
  { value: "sold", labelKey: "statusSold" as const },
  { value: "rented", labelKey: "statusRented" as const },
  { value: "all", labelKey: "allStatus" as const },
];

const TYPES = [
  { value: "all", labelKey: "allTypes" as const },
  { value: "single_family", labelKey: "typeSingleFamily" as const },
  { value: "condo", labelKey: "typeCondo" as const },
  { value: "townhouse", labelKey: "typeTownhouse" as const },
  { value: "villa", labelKey: "typeVilla" as const },
  { value: "multi_family", labelKey: "typeMultiFamily" as const },
  { value: "residential", labelKey: "typeResidential" as const },
  { value: "investment", labelKey: "typeInvestment" as const },
  { value: "commercial", labelKey: "typeCommercial" as const },
  { value: "land", labelKey: "typeLand" as const },
];

const SORTS = [
  { value: "newest", labelKey: "sortNewest" as const },
  { value: "price_asc", labelKey: "sortPriceAsc" as const },
  { value: "price_desc", labelKey: "sortPriceDesc" as const },
  { value: "sqft_desc", labelKey: "sortSqftDesc" as const },
  { value: "beds_desc", labelKey: "sortBedsDesc" as const },
];

const POPULAR_CITIES = [
  "Aventura", "Bal Harbour", "Bay Harbor Islands", "Coconut Grove", "Coral Gables",
  "Cutler Bay", "Doral", "Fort Lauderdale", "Hialeah", "Hollywood", "Homestead",
  "Kendall", "Key Biscayne", "Miami", "Miami Beach", "Miami Lakes", "Miami Shores",
  "North Miami", "North Miami Beach", "Palmetto Bay", "Pembroke Pines", "Pinecrest",
  "Plantation", "South Miami", "Sunny Isles Beach", "Surfside", "Weston",
];

function formatPriceInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString();
}

function unformatPrice(value: string): string {
  return value.replace(/\D/g, "");
}

export default function PropertyFilters({ currentParams }: { currentParams: FilterParams }) {
  const t = useTranslations("PropertyFilters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showMore, setShowMore] = useState(false);

  const [searchInput, setSearchInput] = useState(currentParams.q ?? "");
  const [priceMinDisplay, setPriceMinDisplay] = useState(
    currentParams.price_min ? Number(currentParams.price_min).toLocaleString() : ""
  );
  const [priceMaxDisplay, setPriceMaxDisplay] = useState(
    currentParams.price_max ? Number(currentParams.price_max).toLocaleString() : ""
  );

  const buildHref = useCallback(
    (next: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      for (const [k, v] of Object.entries(next)) {
        if (v === undefined || v === "" || v === "all") params.delete(k);
        else params.set(k, v);
      }
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      startTransition(() => {
        router.push(buildHref({ [key]: value }));
      });
    },
    [router, buildHref]
  );

  const submitSearch = useCallback(() => {
    updateFilter("q", searchInput.trim() || undefined);
  }, [searchInput, updateFilter]);

  const toggleFlag = useCallback(
    (key: "pool" | "waterfront" | "garage" | "include_pending") => {
      const currentVal = currentParams[key];
      updateFilter(key, currentVal ? undefined : "1");
    },
    [currentParams, updateFilter]
  );

  const clearAll = useCallback(() => {
    setPriceMinDisplay("");
    setPriceMaxDisplay("");
    setSearchInput("");
    startTransition(() => {
      router.push(pathname);
    });
  }, [pathname, router]);

  const activeFilters = useMemo(() => {
    const out: Array<{ key: string; label: string }> = [];
    if (currentParams.q) out.push({ key: "q", label: `"${currentParams.q}"` });
    if (currentParams.status && currentParams.status !== "all") {
      const item = STATUSES.find((s) => s.value === currentParams.status);
      if (item) out.push({ key: "status", label: t(item.labelKey) });
    }
    if (currentParams.type && currentParams.type !== "all") {
      const item = TYPES.find((tp) => tp.value === currentParams.type);
      if (item) out.push({ key: "type", label: t(item.labelKey) });
    }
    if (currentParams.city) out.push({ key: "city", label: currentParams.city });
    if (currentParams.price_min)
      out.push({ key: "price_min", label: t("minPill", { value: `$${Number(currentParams.price_min).toLocaleString()}` }) });
    if (currentParams.price_max)
      out.push({ key: "price_max", label: t("maxPill", { value: `$${Number(currentParams.price_max).toLocaleString()}` }) });
    if (currentParams.beds) out.push({ key: "beds", label: t("bedsPlus", { n: currentParams.beds }) });
    if (currentParams.baths) out.push({ key: "baths", label: t("bathsPlus", { n: currentParams.baths }) });
    if (currentParams.sqft_min) out.push({ key: "sqft_min", label: `${Number(currentParams.sqft_min).toLocaleString()}+ sqft` });
    if (currentParams.year_min) out.push({ key: "year_min", label: `${currentParams.year_min}+` });
    if (currentParams.pool) out.push({ key: "pool", label: t("amenityPool") });
    if (currentParams.waterfront) out.push({ key: "waterfront", label: t("amenityWaterfront") });
    if (currentParams.garage) out.push({ key: "garage", label: t("amenityGarage") });
    if (currentParams.include_pending) out.push({ key: "include_pending", label: t("includePending") });
    return out;
  }, [currentParams, t]);

  const hasFilters = activeFilters.length > 0;

  const selectClass =
    "w-full bg-white border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 focus:border-[#C5A55A] transition-colors appearance-none cursor-pointer";

  const inputClass =
    "w-full bg-white border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 focus:border-[#C5A55A] transition-colors placeholder:text-[#6B7280]/60";

  const chipClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-colors ${
      active
        ? "bg-[#C5A55A] text-[#0A1628] border border-[#C5A55A]"
        : "bg-white text-[#6B7280] border border-[#E8E4DE] hover:border-[#C5A55A]/40"
    }`;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm overflow-hidden">
      {/* Loading bar — slim animated stripe at the very top whenever a query is in flight */}
      <div className="relative h-1">
        {isPending && (
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#C5A55A] to-transparent animate-pulse" />
        )}
      </div>

      {/* Hero search row — the universal "search anything" input + explicit Search button */}
      <div className="px-5 pt-5 pb-3">
        <label className="block text-xs font-bold tracking-widest text-[#C5A55A] uppercase mb-2">
          {t("searchLabel")}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1628]/40 pointer-events-none" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
              }}
              className="w-full bg-[#FAF8F5] border-2 border-[#E8E4DE] rounded-2xl pl-12 pr-4 py-3.5 text-base text-[#0A1628] placeholder:text-[#6B7280]/60 focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 focus:border-[#C5A55A] transition-colors"
            />
          </div>
          <button
            onClick={submitSearch}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 bg-[#0A1628] text-white text-sm font-bold px-6 py-3.5 rounded-2xl hover:bg-[#0A1628]/90 disabled:opacity-60 transition-colors"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="hidden sm:inline">{t("searchButton")}</span>
          </button>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-3 mt-2">
          <div className="flex items-center gap-2 text-[#0A1628] font-semibold text-sm">
            <SlidersHorizontal className="w-4 h-4 text-[#C5A55A]" />
            {t("title")}
            {isPending && (
              <span className="flex items-center gap-1.5 text-xs text-[#C5A55A] font-semibold ml-2 bg-[#C5A55A]/10 px-2.5 py-1 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t("searching")}
              </span>
            )}
          </div>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-red-500 transition-colors font-medium"
            >
              <X className="w-3.5 h-3.5" />
              {t("clearFilters")}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <select
            value={currentParams.status ?? "for_sale"}
            onChange={(e) => updateFilter("status", e.target.value)}
            className={selectClass}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {t(s.labelKey)}
              </option>
            ))}
          </select>

          <select
            value={currentParams.type ?? "all"}
            onChange={(e) => updateFilter("type", e.target.value)}
            className={selectClass}
          >
            {TYPES.map((tp) => (
              <option key={tp.value} value={tp.value}>
                {t(tp.labelKey)}
              </option>
            ))}
          </select>

          <input
            inputMode="numeric"
            placeholder={t("minPrice")}
            value={priceMinDisplay}
            onChange={(e) => setPriceMinDisplay(formatPriceInput(e.target.value))}
            onBlur={() => updateFilter("price_min", unformatPrice(priceMinDisplay) || undefined)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilter("price_min", unformatPrice(priceMinDisplay) || undefined);
            }}
            className={inputClass}
          />

          <input
            inputMode="numeric"
            placeholder={t("maxPrice")}
            value={priceMaxDisplay}
            onChange={(e) => setPriceMaxDisplay(formatPriceInput(e.target.value))}
            onBlur={() => updateFilter("price_max", unformatPrice(priceMaxDisplay) || undefined)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilter("price_max", unformatPrice(priceMaxDisplay) || undefined);
            }}
            className={inputClass}
          />

          <select
            value={currentParams.beds ?? ""}
            onChange={(e) => updateFilter("beds", e.target.value || undefined)}
            className={selectClass}
          >
            <option value="">{t("anyBeds")}</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>
                {t("bedsPlus", { n })}
              </option>
            ))}
          </select>

          <select
            value={currentParams.baths ?? ""}
            onChange={(e) => updateFilter("baths", e.target.value || undefined)}
            className={selectClass}
          >
            <option value="">{t("anyBaths")}</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={String(n)}>
                {t("bathsPlus", { n })}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowMore((s) => !s)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A1628] bg-[#0A1628]/5 hover:bg-[#0A1628]/10 px-3 py-2 rounded-full transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {showMore ? t("hideMoreFilters") : t("moreFilters")}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
          </button>

          <div className="ml-auto flex items-center gap-2 text-xs text-[#6B7280]">
            <span>{t("sortLabel")}:</span>
            <select
              value={currentParams.sort ?? "newest"}
              onChange={(e) => updateFilter("sort", e.target.value === "newest" ? undefined : e.target.value)}
              className="bg-white border border-[#E8E4DE] rounded-lg px-2 py-1.5 text-xs text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {t(s.labelKey)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showMore && (
          <div className="mt-5 pt-5 border-t border-[#E8E4DE] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={currentParams.city ?? ""}
              onChange={(e) => updateFilter("city", e.target.value || undefined)}
              className={selectClass}
            >
              <option value="">{t("anyCity")}</option>
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={0}
              placeholder={t("minSqft")}
              defaultValue={currentParams.sqft_min ?? ""}
              onBlur={(e) => updateFilter("sqft_min", e.target.value || undefined)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFilter("sqft_min", (e.target as HTMLInputElement).value || undefined);
              }}
              className={inputClass}
            />

            <input
              type="number"
              min={1850}
              max={new Date().getFullYear() + 2}
              placeholder={t("minYear")}
              defaultValue={currentParams.year_min ?? ""}
              onBlur={(e) => updateFilter("year_min", e.target.value || undefined)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFilter("year_min", (e.target as HTMLInputElement).value || undefined);
              }}
              className={inputClass}
            />

            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => toggleFlag("pool")} className={chipClass(!!currentParams.pool)}>
                <Droplets className="w-3.5 h-3.5" /> {t("amenityPool")}
              </button>
              <button onClick={() => toggleFlag("waterfront")} className={chipClass(!!currentParams.waterfront)}>
                <Waves className="w-3.5 h-3.5" /> {t("amenityWaterfront")}
              </button>
              <button onClick={() => toggleFlag("garage")} className={chipClass(!!currentParams.garage)}>
                <Car className="w-3.5 h-3.5" /> {t("amenityGarage")}
              </button>
            </div>

            <label className="sm:col-span-2 lg:col-span-4 inline-flex items-center gap-2 text-sm text-[#0A1628] cursor-pointer">
              <input
                type="checkbox"
                checked={!!currentParams.include_pending}
                onChange={() => toggleFlag("include_pending")}
                className="w-4 h-4 rounded border-[#E8E4DE] text-[#C5A55A] focus:ring-[#C5A55A]/40 cursor-pointer"
              />
              {t("includePending")}
            </label>
          </div>
        )}

        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E8E4DE]">
            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 bg-[#C5A55A]/10 text-[#0A1628] text-xs font-medium px-3 py-1 rounded-full"
              >
                {f.label}
                <button
                  onClick={() => {
                    if (f.key === "price_min") setPriceMinDisplay("");
                    if (f.key === "price_max") setPriceMaxDisplay("");
                    if (f.key === "q") setSearchInput("");
                    updateFilter(f.key, undefined);
                  }}
                  className="hover:text-red-500 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
