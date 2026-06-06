"use client";

import { useState } from "react";
import { BookmarkPlus, Loader2, Check } from "lucide-react";

type FilterParams = Record<string, string | undefined>;

function describeParams(params: FilterParams): string {
  const parts: string[] = [];
  if (params.status === "for_rent") parts.push("Rentals");
  else if (params.status === "for_sale" || !params.status) parts.push("For Sale");
  else if (params.status === "sold") parts.push("Sold");
  else if (params.status === "rented") parts.push("Rented");
  else if (params.status === "pending") parts.push("Pending");
  if (params.type && params.type !== "all") {
    parts.push(params.type.replace(/_/g, " "));
  }
  if (params.city) parts.push(`in ${params.city}`);
  if (params.beds) parts.push(`${params.beds}+ bed`);
  if (params.baths) parts.push(`${params.baths}+ bath`);
  if (params.price_min || params.price_max) {
    const min = params.price_min ? `$${Number(params.price_min).toLocaleString()}` : "any";
    const max = params.price_max ? `$${Number(params.price_max).toLocaleString()}` : "any";
    parts.push(`${min}–${max}`);
  }
  if (params.q) parts.push(`"${params.q}"`);
  return parts.join(" · ") || "Miami listings";
}

export default function SaveSearchButton({ params }: { params: FilterParams }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState(describeParams(params));
  const [frequency, setFrequency] = useState<"instant" | "daily" | "weekly">("instant");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
      ) as Record<string, string>;
      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, name, params: cleanParams, frequency }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save search");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#D4BA7A] transition-colors"
      >
        <BookmarkPlus className="w-4 h-4" />
        Save this search
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E8E4DE] max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#C5A55A]/15 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-[#C5A55A]" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#0A1628] mb-2">
                  Check your inbox
                </h3>
                <p className="text-sm text-[#6B7280] mb-5">
                  We sent a confirmation link to <span className="font-semibold">{email}</span>. Click
                  it to start receiving alerts when new matching listings hit the Miami MLS.
                </p>
                <button
                  onClick={() => {
                    setOpen(false);
                    setDone(false);
                  }}
                  className="inline-flex items-center gap-2 bg-[#0A1628] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#0A1628]/90 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-playfair text-xl font-bold text-[#0A1628] mb-1">
                  Save & alert me
                </h3>
                <p className="text-sm text-[#6B7280] mb-5">
                  We&apos;ll email you when new MLS listings match these filters. Confirm by clicking
                  the link we send — no account needed.
                </p>

                <label className="block text-xs font-semibold text-[#0A1628] mb-1.5">
                  Name this search
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40"
                  placeholder="e.g. Doral condos under $500k"
                  maxLength={255}
                />

                <label className="block text-xs font-semibold text-[#0A1628] mb-1.5">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40"
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={255}
                />

                <label className="block text-xs font-semibold text-[#0A1628] mb-1.5">
                  Alert frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as "instant" | "daily" | "weekly")}
                  className="w-full border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/40 bg-white"
                >
                  <option value="instant">Instant — as soon as it lists</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
                </select>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    disabled={busy}
                    className="text-sm text-[#6B7280] hover:text-[#0A1628] font-medium px-4 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    disabled={busy || !email || !name}
                    className="inline-flex items-center gap-2 bg-[#0A1628] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#0A1628]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                    {busy ? "Sending…" : "Save & confirm via email"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
