/**
 * Health check — extends i18n audit with smoke tests + schema validation.
 *
 * Catches:
 *   - Routes 500/404 unexpectedly (after refactors, dependency upgrades, etc.)
 *   - JSON-LD schemas broken or missing (silent loss of AI/Google citations)
 *   - Sitemap, robots, llms.txt unreachable
 *   - OG image generation broken
 *
 * Usage: npm run health:check
 *   Defaults to http://localhost:3000
 *   Override: AUDIT_BASE_URL=https://leorealtycapitalinvestments.com npm run health:check
 */

const BASE_URL = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";

type Check = {
  name: string;
  url: string;
  expectStatus: number | number[];
  contentType?: string;
  mustContain?: string[];
  mustHaveJsonLd?: string[]; // schema.org @type values that must be present
};

const CHECKS: Check[] = [
  // Public route smoke tests — every public page must 200
  { name: "homepage en", url: "/", expectStatus: 200 },
  { name: "homepage fr", url: "/fr", expectStatus: 200 },
  { name: "homepage ht", url: "/ht", expectStatus: 200 },
  { name: "about", url: "/about", expectStatus: 200 },
  { name: "services", url: "/services", expectStatus: 200 },
  { name: "contact", url: "/contact", expectStatus: 200 },
  { name: "loan-programs", url: "/loan-programs", expectStatus: 200 },
  { name: "properties", url: "/properties", expectStatus: 200 },
  { name: "team", url: "/team", expectStatus: 200 },
  { name: "testimonials", url: "/testimonials", expectStatus: 200 },
  { name: "promotions", url: "/promotions", expectStatus: 200 },
  { name: "blog list", url: "/blog", expectStatus: 200 },
  { name: "privacy", url: "/privacy", expectStatus: 200 },
  { name: "terms", url: "/terms", expectStatus: 200 },
  { name: "fair-housing", url: "/fair-housing", expectStatus: 200 },
  { name: "neighborhood (NMB)", url: "/neighborhoods/north-miami-beach", expectStatus: 200 },
  { name: "blog post", url: "/blog/investing-in-real-estate", expectStatus: 200 },

  // Metadata routes
  { name: "sitemap.xml", url: "/sitemap.xml", expectStatus: 200, mustContain: ["<urlset", "leorealtycapitalinvestments.com"] },
  { name: "robots.txt", url: "/robots.txt", expectStatus: 200 },
  { name: "llms.txt", url: "/llms.txt", expectStatus: 200, mustContain: ["Leo Realty", "MR 2%"] },
  { name: "OG image (root)", url: "/opengraph-image", expectStatus: 200, contentType: "image/png" },

  // Admin routes (unaffected by i18n, must still work)
  { name: "admin login", url: "/admin/login", expectStatus: 200 },

  // 404 must work for unknown neighborhood
  { name: "404 unknown neighborhood", url: "/neighborhoods/atlantis", expectStatus: 404 },

  // Schema markup checks — homepage must have RealEstateAgent + WebSite
  { name: "homepage JSON-LD", url: "/", expectStatus: 200, mustHaveJsonLd: ["RealEstateAgent", "LocalBusiness", "WebSite"] },
  { name: "loan-programs FAQ schema", url: "/loan-programs", expectStatus: 200, mustHaveJsonLd: ["FAQPage"] },
  { name: "neighborhood Place schema", url: "/neighborhoods/brickell", expectStatus: 200, mustHaveJsonLd: ["Place"] },
];

async function runCheck(c: Check): Promise<{ pass: boolean; reason?: string }> {
  try {
    const res = await fetch(BASE_URL + c.url, { redirect: "manual" });
    const expected = Array.isArray(c.expectStatus) ? c.expectStatus : [c.expectStatus];
    if (!expected.includes(res.status)) {
      return { pass: false, reason: `expected ${expected.join("|")} got ${res.status}` };
    }

    if (c.contentType) {
      const ct = res.headers.get("content-type") ?? "";
      if (!ct.includes(c.contentType)) {
        return { pass: false, reason: `expected content-type ${c.contentType}, got ${ct}` };
      }
    }

    const body = await res.text();

    if (c.mustContain) {
      for (const needle of c.mustContain) {
        if (!body.includes(needle)) {
          return { pass: false, reason: `body missing "${needle}"` };
        }
      }
    }

    if (c.mustHaveJsonLd) {
      const scripts = body.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) ?? [];
      const allTypes = new Set<string>();
      for (const s of scripts) {
        const json = s.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "")
          .replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&");
        try {
          const parsed = JSON.parse(json);
          const items = Array.isArray(parsed) ? parsed : [parsed];
          for (const item of items) {
            const t = item["@type"];
            if (Array.isArray(t)) t.forEach((x) => allTypes.add(x));
            else if (typeof t === "string") allTypes.add(t);
          }
        } catch {
          return { pass: false, reason: `invalid JSON-LD: ${json.slice(0, 80)}` };
        }
      }
      for (const required of c.mustHaveJsonLd) {
        if (!allTypes.has(required)) {
          return { pass: false, reason: `missing JSON-LD @type "${required}". Found: ${[...allTypes].join(",") || "none"}` };
        }
      }
    }

    return { pass: true };
  } catch (err) {
    return { pass: false, reason: `fetch error: ${err instanceof Error ? err.message : String(err)}` };
  }
}

async function main() {
  console.log(`\n🩺 Health check against ${BASE_URL}\n`);
  console.log(`Running ${CHECKS.length} checks...\n`);

  let failed = 0;
  for (const c of CHECKS) {
    const { pass, reason } = await runCheck(c);
    if (pass) {
      console.log(`✅ ${c.name.padEnd(35)} ${c.url}`);
    } else {
      failed++;
      console.log(`❌ ${c.name.padEnd(35)} ${c.url}  →  ${reason}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  if (failed > 0) {
    console.log(`❌ ${failed} of ${CHECKS.length} checks failed`);
    process.exit(1);
  }
  console.log(`✅ All ${CHECKS.length} checks passed`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Health check crashed:", err);
  process.exit(2);
});
