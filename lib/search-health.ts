// Search health monitor — runs the real MLS search queries and asserts the
// invariants that have bitten us before (case-sensitivity, empty results, test
// listings leaking). Used by:
//   - /api/cron/search-health  (scheduled, emails an alert the moment it breaks)
//   - npm run search:check      (on-demand / pre-deploy gate)
//
// Relative import (not "@/…") so the tsx script can run it without alias config.
import { searchProperties, isTestListing } from "./mls";

export type SearchCheck = { name: string; pass: boolean; detail: string };
export type SearchHealthReport = {
  healthy: boolean;
  ranAt: string;
  checks: SearchCheck[];
  failures: SearchCheck[];
};

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const BREVO_TIMEOUT_MS = 8_000;

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

/** Total match count for a query (top:1 — we only read the OData count). */
async function total(params: Parameters<typeof searchProperties>[0]): Promise<number> {
  const r = await searchProperties({ top: 1, ...params });
  return r.total;
}

/**
 * Run the search invariants. Each check is independent and never throws — a
 * thrown query becomes a failed check (so a broken MLS token alerts too).
 */
export async function runSearchHealthChecks(): Promise<SearchHealthReport> {
  const checks: SearchCheck[] = [];
  const add = (name: string, pass: boolean, detail: string) => checks.push({ name, pass, detail });

  // 1) THE regression guard: free-text search MUST be case-insensitive.
  //    This is the exact bug that returned 0 for "broward". If anyone removes
  //    tolower() / .toLowerCase() from buildFilter, the three counts diverge
  //    (or all collapse to 0) and this fails.
  try {
    const [lc, tc, uc] = await Promise.all([
      total({ statusBucket: "all", q: "broward" }),
      total({ statusBucket: "all", q: "Broward" }),
      total({ statusBucket: "all", q: "BROWARD" }),
    ]);
    const pass = lc > 0 && lc === tc && tc === uc;
    add(
      "case-insensitive search (broward)",
      pass,
      pass
        ? `consistent & non-zero (${lc.toLocaleString()})`
        : `MISMATCH — search is case-sensitive again: lower=${lc} Title=${tc} UPPER=${uc}`
    );
  } catch (e) {
    add("case-insensitive search (broward)", false, `threw: ${msg(e)}`);
  }

  // 2) Known South-Florida locations must return results.
  for (const term of ["hollywood", "miami", "aventura", "fort lauderdale"]) {
    try {
      const n = await total({ statusBucket: "all", q: term });
      add(`search "${term}"`, n > 0, `${n.toLocaleString()} results`);
    } catch (e) {
      add(`search "${term}"`, false, `threw: ${msg(e)}`);
    }
  }

  // 3) ZIP-code search must work.
  try {
    const n = await total({ statusBucket: "all", q: "33139" });
    add('search ZIP "33139"', n > 0, `${n.toLocaleString()} results`);
  } catch (e) {
    add('search ZIP "33139"', false, `threw: ${msg(e)}`);
  }

  // 4) The exact filter combination that originally returned 0.
  try {
    const n = await total({
      statusBucket: "for_rent",
      propertyTypeKey: "townhouse",
      minBeds: 2,
      minBaths: 2,
      maxPrice: 3000,
      q: "broward",
    });
    add("filtered: broward townhouse rental ≤$3k, 2bd/2ba", n > 0, `${n.toLocaleString()} results`);
  } catch (e) {
    add("filtered: broward townhouse rental ≤$3k, 2bd/2ba", false, `threw: ${msg(e)}`);
  }

  // 5) A bare for-sale search must return real inventory.
  try {
    const n = await total({ statusBucket: "for_sale" });
    add("default for-sale search", n > 100, `${n.toLocaleString()} results`);
  } catch (e) {
    add("default for-sale search", false, `threw: ${msg(e)}`);
  }

  // 6) No test / "do-not-post" listings may leak into results.
  try {
    const { listings } = await searchProperties({ statusBucket: "for_sale", sort: "price_asc", top: 50 });
    const leaked = listings.filter(isTestListing);
    add(
      "no test/DNP listings in results",
      leaked.length === 0,
      leaked.length === 0
        ? "clean"
        : `${leaked.length} leaked: ${leaked.slice(0, 3).map((l) => l.unparsedAddress).join("; ")}`
    );
  } catch (e) {
    add("no test/DNP listings in results", false, `threw: ${msg(e)}`);
  }

  const failures = checks.filter((c) => !c.pass);
  return { healthy: failures.length === 0, ranAt: new Date().toISOString(), checks, failures };
}

/**
 * Email an alert to the team inbox when search breaks. Mirrors lib/lead-notify's
 * Brevo pattern: hard timeout, never throws. Returns whether the send succeeded.
 */
export async function sendSearchHealthAlert(report: SearchHealthReport): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[search-health] BREVO_API_KEY not set — cannot send alert");
    return false;
  }
  const to = (process.env.LEAD_NOTIFY_EMAIL || "Info@leorealtycapitalinvestments.com")
    .split(",")
    .map((e) => ({ email: e.trim() }))
    .filter((r) => r.email);
  const sender = {
    email: process.env.BREVO_SENDER_EMAIL || "noreply@leorealtycapitalinvestments.com",
    name: "Leo Realty Site Monitor",
  };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://leorealtycapitalinvestments.com";

  const rows = report.failures
    .map(
      (f) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #f0eee9;color:#b91c1c;font-weight:600;white-space:nowrap">✗ ${esc(
          f.name
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #f0eee9;color:#374151">${esc(f.detail)}</td></tr>`
    )
    .join("");

  const n = report.failures.length;
  const subject = `🚨 Leo Realty — Property search FAILING (${n} check${n === 1 ? "" : "s"})`;
  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#0A1628">
      <div style="border-left:3px solid #b91c1c;padding-left:16px;margin-bottom:20px">
        <div style="color:#b91c1c;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700">Search Monitor — Action Needed</div>
        <h1 style="margin:6px 0 0 0;font-size:21px;font-weight:700">Property search is failing</h1>
        <div style="color:#6b7280;font-size:13px;margin-top:4px">${esc(report.ranAt)}</div>
      </div>
      <p style="font-size:14px;line-height:1.6;color:#374151;margin:0 0 16px">
        The automated monitor ran the live MLS search and ${n} check${n === 1 ? "" : "s"} failed.
        Visitors may be getting zero or wrong results. Details:
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #f0eee9;border-radius:8px;overflow:hidden">
        ${rows}
      </table>
      <div style="margin-top:24px">
        <a href="${esc(siteUrl)}/properties?q=broward" style="display:inline-block;background:#0A1628;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Open the search →</a>
      </div>
      <p style="margin-top:22px;color:#9ca3af;font-size:12px">Automated by the Leo Realty search-health monitor. This will repeat until the checks pass again.</p>
    </div>
  `.trim();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BREVO_TIMEOUT_MS);
  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ sender, to, subject, htmlContent, tags: ["search-health-alert"] }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`[search-health] Brevo ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[search-health] alert send failed:", msg(e));
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
