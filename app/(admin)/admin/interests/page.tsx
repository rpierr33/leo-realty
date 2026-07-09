"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Heart, PhoneCall, BadgeCheck, Clock, ExternalLink } from "lucide-react";

type Row = {
  id: number;
  email: string;
  listingKey: string;
  reaction: "interested" | "loved" | "will_contact";
  addressSnapshot: string | null;
  priceSnapshot: number | null;
  citySnapshot: string | null;
  verifiedAt: string | null;
  updatedAt: string;
};

const REACTION_META = {
  will_contact: { label: "Will contact", Icon: PhoneCall, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  loved: { label: "Loved", Icon: Heart, cls: "bg-rose-50 text-rose-700 border-rose-200" },
  interested: { label: "Interested", Icon: Eye, cls: "bg-sky-50 text-sky-700 border-sky-200" },
} as const;

function fmtPrice(p: number | null): string {
  if (!p) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p);
}

export default function AdminInterestsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/interests")
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setRows(d.rows ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const visitors = useMemo(() => {
    const byEmail = new Map<string, { email: string; verified: boolean; latest: string; items: Row[] }>();
    for (const r of rows) {
      const v = byEmail.get(r.email) ?? { email: r.email, verified: false, latest: r.updatedAt, items: [] };
      v.items.push(r);
      v.verified = v.verified || !!r.verifiedAt;
      if (r.updatedAt > v.latest) v.latest = r.updatedAt;
      byEmail.set(r.email, v);
    }
    return [...byEmail.values()].sort((a, b) => (a.latest < b.latest ? 1 : -1));
  }, [rows]);

  const totals = useMemo(
    () => ({
      visitors: visitors.length,
      verified: visitors.filter((v) => v.verified).length,
      willContact: rows.filter((r) => r.reaction === "will_contact").length,
      loved: rows.filter((r) => r.reaction === "loved").length,
      interested: rows.filter((r) => r.reaction === "interested").length,
    }),
    [visitors, rows]
  );

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A1628]">Buyer Interests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Listings visitors tagged while searching — claimed and verified by email. Verified lists also
          arrive by email the moment they're confirmed.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          ["Visitors", totals.visitors],
          ["Verified", totals.verified],
          ["Will contact", totals.willContact],
          ["Loved", totals.loved],
          ["Interested", totals.interested],
        ].map(([label, n]) => (
          <div key={label} className="bg-white border border-[#E8E4DE] rounded-xl px-4 py-3">
            <div className="text-2xl font-bold text-[#0A1628]">{n}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 py-10">Loading…</div>
      ) : error ? (
        <div className="text-sm text-red-600 py-10">Failed to load interests: {error}</div>
      ) : visitors.length === 0 ? (
        <div className="bg-white border border-[#E8E4DE] rounded-xl p-10 text-center text-sm text-gray-500">
          No visitor interests yet. They appear here the moment a visitor emails themselves their list.
        </div>
      ) : (
        <div className="space-y-5">
          {visitors.map((v) => (
            <div key={v.email} className="bg-white border border-[#E8E4DE] rounded-xl overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#F0EDE8]">
                <a href={`mailto:${v.email}`} className="font-semibold text-[#0A1628] hover:text-[#C5A55A]">
                  {v.email}
                </a>
                {v.verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" /> Pending verification
                  </span>
                )}
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(v.latest).toLocaleString()}
                </span>
              </div>
              <ul className="divide-y divide-[#F5F2ED]">
                {v.items.map((r) => {
                  const meta = REACTION_META[r.reaction];
                  return (
                    <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-1 rounded-full ${meta.cls}`}
                      >
                        <meta.Icon className="w-3.5 h-3.5" /> {meta.label}
                      </span>
                      <span className="text-[#0A1628] font-medium">
                        {[r.addressSnapshot, r.citySnapshot].filter(Boolean).join(", ") || r.listingKey}
                      </span>
                      <span className="text-gray-500">{fmtPrice(r.priceSnapshot)}</span>
                      <a
                        href={`/properties/${encodeURIComponent(r.listingKey)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center gap-1 text-xs text-[#0A1628] hover:text-[#C5A55A] font-semibold"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
