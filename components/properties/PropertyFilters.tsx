"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

type FilterParams = {
  type?: string;
  status?: string;
  price_min?: string;
  price_max?: string;
  beds?: string;
  baths?: string;
  q?: string;
};

const STATUSES = [
  { value: "all", label: "All Status" },
  { value: "for_sale", label: "For Sale" },
  { value: "for_rent", label: "For Rent" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
];

const TYPES = [
  { value: "all", label: "All Types" },
  { value: "residential", label: "Residential" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "commercial", label: "Commercial" },
  { value: "multi_family", label: "Multi-Family" },
  { value: "land", label: "Land" },
  { value: "investment", label: "Investment" },
];

const BEDS_OPTIONS = [
  { value: "", label: "Any Beds" },
  { value: "1", label: "1+ Beds" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
  { value: "5", label: "5+ Beds" },
];

const BATHS_OPTIONS = [
  { value: "", label: "Any Baths" },
  { value: "1", label: "1+ Baths" },
  { value: "2", label: "2+ Baths" },
  { value: "3", label: "3+ Baths" },
];

const PRICE_OPTIONS = [
  { value: "", label: "No Min" },
  { value: "100000", label: "$100K" },
  { value: "200000", label: "$200K" },
  { value: "300000", label: "$300K" },
  { value: "500000", label: "$500K" },
  { value: "750000", label: "$750K" },
  { value: "1000000", label: "$1M" },
  { value: "2000000", label: "$2M" },
];

const PRICE_MAX_OPTIONS = [
  { value: "", label: "No Max" },
  { value: "200000", label: "$200K" },
  { value: "400000", label: "$400K" },
  { value: "600000", label: "$600K" },
  { value: "800000", label: "$800K" },
  { value: "1000000", label: "$1M" },
  { value: "1500000", label: "$1.5M" },
  { value: "2000000", label: "$2M" },
  { value: "5000000", label: "$5M" },
];

export default function PropertyFilters({ currentParams }: { currentParams: FilterParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      const merged = { ...currentParams, [key]: value };
      for (const [k, v] of Object.entries(merged)) {
        if (v && v !== "all") params.set(k, v);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [currentParams, pathname, router]
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [pathname, router]);

  const hasFilters = Object.values(currentParams).some((v) => v && v !== "all");

  const selectClass =
    "w-full bg-white border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 focus:border-[#C5A55A] transition-colors appearance-none cursor-pointer";

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#0A1628] font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#C5A55A]" />
          Filter Properties
          {isPending && <span className="text-xs text-[#6B7280] font-normal ml-1">Searching...</span>}
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-red-500 transition-colors font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* Search text */}
        <div className="sm:col-span-2 xl:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          <input
            type="text"
            placeholder="Search city, address, title..."
            defaultValue={currentParams.q ?? ""}
            className="w-full bg-white border border-[#E8E4DE] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#0A1628] placeholder:text-[#6B7280]/60 focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 focus:border-[#C5A55A] transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("q", (e.target as HTMLInputElement).value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value !== (currentParams.q ?? "")) {
                updateFilter("q", e.target.value);
              }
            }}
          />
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={currentParams.status ?? "all"}
            onChange={(e) => updateFilter("status", e.target.value)}
            className={selectClass}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="relative">
          <select
            value={currentParams.type ?? "all"}
            onChange={(e) => updateFilter("type", e.target.value)}
            className={selectClass}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Price Min */}
        <div className="relative">
          <select
            value={currentParams.price_min ?? ""}
            onChange={(e) => updateFilter("price_min", e.target.value)}
            className={selectClass}
          >
            {PRICE_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Price Max */}
        <div className="relative">
          <select
            value={currentParams.price_max ?? ""}
            onChange={(e) => updateFilter("price_max", e.target.value)}
            className={selectClass}
          >
            {PRICE_MAX_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Beds */}
        <div className="relative">
          <select
            value={currentParams.beds ?? ""}
            onChange={(e) => updateFilter("beds", e.target.value)}
            className={selectClass}
          >
            {BEDS_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E8E4DE]">
          {currentParams.q && (
            <span className="inline-flex items-center gap-1 bg-[#0A1628]/5 text-[#0A1628] text-xs font-medium px-3 py-1 rounded-full">
              Search: &quot;{currentParams.q}&quot;
              <button onClick={() => updateFilter("q", "")} className="hover:text-red-500 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.status && currentParams.status !== "all" && (
            <span className="inline-flex items-center gap-1 bg-[#C5A55A]/10 text-[#C5A55A] text-xs font-medium px-3 py-1 rounded-full">
              {STATUSES.find((s) => s.value === currentParams.status)?.label}
              <button onClick={() => updateFilter("status", "all")} className="hover:text-red-500 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.type && currentParams.type !== "all" && (
            <span className="inline-flex items-center gap-1 bg-[#0A1628]/5 text-[#0A1628] text-xs font-medium px-3 py-1 rounded-full">
              {TYPES.find((t) => t.value === currentParams.type)?.label}
              <button onClick={() => updateFilter("type", "all")} className="hover:text-red-500 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.price_min && (
            <span className="inline-flex items-center gap-1 bg-[#0A1628]/5 text-[#0A1628] text-xs font-medium px-3 py-1 rounded-full">
              Min: {PRICE_OPTIONS.find((p) => p.value === currentParams.price_min)?.label ?? `$${currentParams.price_min}`}
              <button onClick={() => updateFilter("price_min", "")} className="hover:text-red-500 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.price_max && (
            <span className="inline-flex items-center gap-1 bg-[#0A1628]/5 text-[#0A1628] text-xs font-medium px-3 py-1 rounded-full">
              Max: {PRICE_MAX_OPTIONS.find((p) => p.value === currentParams.price_max)?.label ?? `$${currentParams.price_max}`}
              <button onClick={() => updateFilter("price_max", "")} className="hover:text-red-500 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentParams.beds && (
            <span className="inline-flex items-center gap-1 bg-[#0A1628]/5 text-[#0A1628] text-xs font-medium px-3 py-1 rounded-full">
              {BEDS_OPTIONS.find((b) => b.value === currentParams.beds)?.label}
              <button onClick={() => updateFilter("beds", "")} className="hover:text-red-500 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
