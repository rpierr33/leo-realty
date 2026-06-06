"use client";

import { useState } from "react";
import { Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  search: {
    id: number;
    name: string;
    frequency: string;
    verifiedAt: string | null;
    paramsJson: Record<string, string>;
  };
  token: string;
};

export default function SavedSearchRow({ search, token }: Props) {
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  const qs = new URLSearchParams(search.paramsJson).toString();
  const browseHref = `/properties${qs ? `?${qs}` : ""}`;

  async function remove() {
    if (!confirm(`Remove "${search.name}"?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/saved-searches/${search.id}?token=${encodeURIComponent(token)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setRemoved(true);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (removed) return null;

  return (
    <li className="border border-[#E8E4DE] rounded-xl p-4 bg-[#FAF8F5]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[#0A1628]">{search.name}</div>
          <div className="text-xs text-[#6B7280] mt-1">
            Frequency: <span className="font-medium">{search.frequency}</span> ·{" "}
            {search.verifiedAt ? "Active" : "Awaiting confirmation"}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={browseHref}
            className="inline-flex items-center gap-1.5 bg-[#0A1628] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0A1628]/90"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Run
          </Link>
          <button
            onClick={remove}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-red-500 text-xs font-semibold px-2 py-2 rounded-lg disabled:opacity-40"
            aria-label="Remove saved search"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </li>
  );
}
