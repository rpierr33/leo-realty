// Shared URL-param parsing for every listing-search surface (grid page, map
// page, /api/mls/search, listing-alerts cron). One implementation so the
// surfaces can't drift apart — a param one surface understands, they all do.

export function parseNumberParam(raw: string | null | undefined): number | undefined {
  if (raw === null || raw === undefined || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

// Price params arrive from shared links, saved-search emails, and hand-edited
// URLs — accept "$450,000", "450k", "1.5m" instead of silently dropping the
// bound (a dropped max is how visitors end up seeing million-dollar homes on a
// $450k search).
export function parsePriceParam(raw: string | null | undefined): number | undefined {
  if (raw === null || raw === undefined || raw === "") return undefined;
  const cleaned = raw.trim().replace(/^\$/, "").replace(/,/g, "");
  const shorthand = cleaned.match(/^([\d.]+)\s*([kKmM])$/);
  const n = shorthand
    ? Number(shorthand[1]) * (/k/i.test(shorthand[2]) ? 1_000 : 1_000_000)
    : Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

export function parseFlagParam(raw: string | null | undefined): boolean | undefined {
  if (!raw) return undefined;
  if (raw === "1" || raw === "true" || raw === "yes") return true;
  return undefined;
}
