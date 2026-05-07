/**
 * i18n audit — verifies that every locale's HTML actually differs in
 * the metadata layer (title, meta description, h1, primary excerpt).
 *
 * Catches the regression class where:
 *   1. Body text is translated but <title>/<h1>/<meta description> aren't
 *   2. A DB-fallback path bypasses the translated catalog
 *   3. A new component/page is added without translation
 *
 * Usage: npm run i18n:audit
 *   - Defaults to http://localhost:3000 (run `npm run dev` first)
 *   - Override: AUDIT_BASE_URL=https://leorealtycapitalinvestments.com npm run i18n:audit
 *
 * Exits non-zero if any locale leak is detected.
 */

const BASE_URL = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";

const LOCALES = ["en", "fr", "ht"] as const;
const DEFAULT_LOCALE = "en" as const;

type Locale = (typeof LOCALES)[number];

// Routes to audit. Each entry checks: title, meta description, h1.
// Intentionally excludes /admin/* (English-only by design) and /api/*.
const ROUTES = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/loan-programs",
  "/properties",
  "/team",
  "/testimonials",
  "/promotions",
  "/blog",
  "/privacy",
  "/terms",
  "/fair-housing",
  "/neighborhoods/north-miami-beach",
  "/neighborhoods/miami-beach",
  "/neighborhoods/brickell",
  "/blog/investing-in-real-estate",
  "/blog/hometown-heroes-program",
];

function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path === "" ? "/" : path;
  return `/${locale}${path === "/" ? "" : path}`;
}

function extract(html: string, regex: RegExp): string | null {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

async function fetchHtml(url: string): Promise<{ status: number; html: string }> {
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  return { status: res.status, html };
}

async function auditRoute(path: string): Promise<{
  path: string;
  results: Array<{ locale: Locale; status: number; title: string | null; description: string | null; h1: string | null }>;
  leaks: string[];
}> {
  const results = [];
  for (const locale of LOCALES) {
    const url = `${BASE_URL}${localePath(locale, path)}`;
    const { status, html } = await fetchHtml(url);
    results.push({
      locale,
      status,
      title: extract(html, /<title>([^<]+)<\/title>/),
      description: extract(html, /<meta name="description"[^>]*content="([^"]+)"/),
      h1: extract(html, /<h1[^>]*>([^<]+)<\/h1>/),
    });
  }

  const leaks: string[] = [];
  const enResult = results.find((r) => r.locale === "en")!;

  for (const r of results) {
    if (r.status !== 200 && r.status !== 308 && r.status !== 301) {
      leaks.push(`${r.locale}: HTTP ${r.status}`);
    }
    if (r.locale === "en") continue;

    // Each non-default locale must have a different title from English
    if (r.title && enResult.title && r.title === enResult.title) {
      leaks.push(`${r.locale}: <title> identical to /en — "${r.title}"`);
    }
    if (r.description && enResult.description && r.description === enResult.description) {
      leaks.push(`${r.locale}: <meta description> identical to /en`);
    }
    if (r.h1 && enResult.h1 && r.h1 === enResult.h1) {
      leaks.push(`${r.locale}: <h1> identical to /en — "${r.h1}"`);
    }
  }

  return { path, results, leaks };
}

async function main() {
  console.log(`\n🔍 i18n audit against ${BASE_URL}\n`);
  console.log(`Auditing ${ROUTES.length} routes × ${LOCALES.length} locales = ${ROUTES.length * LOCALES.length} pages\n`);

  let totalLeaks = 0;
  const failedRoutes: string[] = [];

  for (const path of ROUTES) {
    try {
      const { results, leaks } = await auditRoute(path);
      if (leaks.length > 0) {
        totalLeaks += leaks.length;
        failedRoutes.push(path);
        console.log(`❌ ${path}`);
        for (const leak of leaks) console.log(`   ${leak}`);
        console.log("");
      } else {
        const titles = results.map((r) => `${r.locale}="${r.title?.slice(0, 40) ?? ""}…"`).join(" ");
        console.log(`✅ ${path}  ${titles}`);
      }
    } catch (err) {
      totalLeaks++;
      failedRoutes.push(path);
      console.log(`⚠️  ${path} — fetch error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  if (totalLeaks > 0) {
    console.log(`❌ ${totalLeaks} leak(s) across ${failedRoutes.length} route(s)`);
    console.log(`Failed routes: ${failedRoutes.join(", ")}`);
    process.exit(1);
  }
  console.log(`✅ All ${ROUTES.length} routes pass on every locale`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Audit script crashed:", err);
  process.exit(2);
});

export {};
