"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Waves, Car, Droplets } from "lucide-react";

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
  city?: string;
  sort?: string;
  q?: string;
};

const STATUSES = [
  { value: "for_sale", label: "For Sale" },
  { value: "for_rent", label: "For Rent" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
  { value: "all", label: "All Status" },
];

const TYPES = [
  { value: "all", label: "All Property Types" },
  { value: "single_family", label: "Single Family" },
  { value: "condo", label: "Condominium" },
  { value: "townhouse", label: "Townhouse" },
  { value: "villa", label: "Villa" },
  { value: "multi_family", label: "Multi-Family / Duplex" },
  { value: "residential", label: "Any Residential" },
  { value: "investment", label: "Income / Investment" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land / Lot" },
];

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "sqft_desc", label: "Largest first" },
  { value: "beds_desc", label: "Most bedrooms" },
];

const BEDS_OPTIONS = [
  { value: "", label: "Any Beds" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

const BATHS_OPTIONS = [
  { value: "", label: "Any Baths" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

// Miami-Dade + Broward popular cities (alphabetical)
const POPULAR_CITIES = [
  "Aventura",
  "Bal Harbour",
  "Bay Harbor Islands",
  "Coconut Grove",
  "Coral Gables",
  "Cutler Bay",
  "Doral",
  "Fort Lauderdale",
  "Hialeah",
  "Hollywood",
  "Homestead",
  "Kendall",
  "Key Biscayne",
  "Miami",
  "Miami Beach",
  "Miami Lakes",
  "Miami Shores",
  "North Miami",
  "North Miami Beach",
  "Palmetto Bay",
  "Pembroke Pines",
  "Pinecrest",
  "Plantation",
  "South Miami",
  "Sunny Isles Beach",
  "Surfside",
  "Weston",
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showMore, setShowMore] = useState(false);

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

  const toggleFlag = useCallback(
    (key: "pool" | "waterfront" | "garage") => {
      const currentVal = currentParams[key];
      updateFilter(key, currentVal ? undefined : "1");
    },
    [currentParams, updateFilter]
  );

  const clearAll = useCallback(() => {
    setPriceMinDisplay("");
    setPriceMaxDisplay("");
    startTransition(() => {
      router.push(pathname);
    });
  }, [pathname, router]);

  const activeFilters = useMemo(() => {
    const out: Array<{ key: string; label: string }> = [];
    if (currentParams.q) out.push({ key: "q", label: `"${currentParams.q}"` });
    if (currentParams.status && currentParams.status !== "all") {
      out.push({ key: "status", label: STATUSES.find((s) => s.value === currentParams.status)?.label ?? currentParams.status });
    }
    if (currentParams.type && currentParams.type !== "all") {
      out.push({ key: "type", label: TYPES.find((t) => t.value === currentParams.type)?.label ?? currentParams.type });
    }
    if (currentParams.city) out.push({ key: "city", label: currentParams.city });
    if (currentParams.price_min) out.push({ key: "price_min", label: `Min $${Number(currentParams.price_min).toLocaleString()}` });
    if (currentParams.price_max) out.push({ key: "price_max", label: `Max $${Number(currentParams.price_max).toLocaleString()}` });
    if (currentParams.beds) out.push({ key: "beds", label: `${currentParams.beds}+ beds` });
    if (currentParams.baths) out.push({ key: "baths", label: `${currentParams.baths}+ baths` });
    if (currentParams.sqft_min) out.push({ key: "sqft_min", label: `${Number(currentParams.sqft_min).toLocaleString()}+ sqft` });
    if (currentParams.year_min) out.push({ key: "year_min", label: `Built ${currentParams.year_min}+` });
    if (currentParams.pool) out.push({ key: "pool", label: "Pool" });
    if (currentParams.waterfront) out.push({ key: "waterfront", label: "Waterfront" });
    if (currentParams.garage) out.push({ key: "garage", label: "Garage" });
    return out;
  }, [currentParams]);

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
    <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#0A1628] font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#C5A55A]" />
          Filter Properties
          {isPending && <span className="text-xs text-[#6B7280] font-normal ml-1">Searching…</span>}
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-red-500 transition-colors font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        <div className="sm:col-span-2 xl:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          <input
            type="text"
            placeholder="Search city, address, ZIP, subdivision…"
            defaultValue={currentParams.q ?? ""}
            className="w-full bg-white border border-[#E8E4DE] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#0A1628] placeholder:text-[#6B7280]/60 focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 focus:border-[#C5A55A] transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("q", (e.target as HTMLInputElement).value || undefined);
              }
            }}
            onBlur={(e) => {
              if (e.target.value !== (currentParams.q ?? "")) {
                updateFilter("q", e.target.value || undefined);
              }
            }}
          />
        </div>

        <select
          value={currentParams.status ?? "for_sale"}
          onChange={(e) => updateFilter("status", e.target.value)}
          className={selectClass}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
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
              {tp.label}
            </option>
          ))}
        </select>

        <input
          inputMode="numeric"
          placeholder="Min price"
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
          placeholder="Max price"
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
          {BEDS_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>

        <select
          value={currentParams.baths ?? ""}
          onChange={(e) => updateFilter("baths", e.target.value || undefined)}
          className={selectClass}
        >
          {BATHS_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
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
          {showMore ? "Hide more filters" : "More filters"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
        </button>

        <div className="ml-auto flex items-center gap-2 text-xs text-[#6B7280]">
          <span>Sort:</span>
          <select
            value={currentParams.sort ?? "newest"}
            onChange={(e) => updateFilter("sort", e.target.value === "newest" ? undefined : e.target.value)}
            className="bg-white border border-[#E8E4DE] rounded-lg px-2 py-1.5 text-xs text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
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
            <option value="">Any City</option>
            {POPULAR_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            placeholder="Min sq ft"
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
            placeholder="Built after (year)"
            defaultValue={currentParams.year_min ?? ""}
            onBlur={(e) => updateFilter("year_min", e.target.value || undefined)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilter("year_min", (e.target as HTMLInputElement).value || undefined);
            }}
            className={inputClass}
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => toggleFlag("pool")} className={chipClass(!!currentParams.pool)}>
              <Droplets className="w-3.5 h-3.5" /> Pool
            </button>
            <button onClick={() => toggleFlag("waterfront")} className={chipClass(!!currentParams.waterfront)}>
              <Waves className="w-3.5 h-3.5" /> Waterfront
            </button>
            <button onClick={() => toggleFlag("garage")} className={chipClass(!!currentParams.garage)}>
              <Car className="w-3.5 h-3.5" /> Garage
            </button>
          </div>
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
  );
}
