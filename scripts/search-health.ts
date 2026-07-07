/**
 * Search health check — run the live MLS search invariants on demand.
 *
 * Usage:
 *   npm run search:check                  # run checks, exit 1 if any fail
 *   npm run search:check -- --alert       # also email the team inbox on failure
 *   npm run search:check -- --test-alert  # send a sample alert email (proves delivery)
 */
import { config } from "dotenv";
import type { SearchHealthReport } from "../lib/search-health";

// Load env BEFORE importing lib/mls (which reads MLS_SERVER_TOKEN at module load).
config({ path: ".env.local" });

async function main() {
  const args = process.argv.slice(2);
  const { runSearchHealthChecks, sendSearchHealthAlert } = await import("../lib/search-health");

  if (args.includes("--test-alert")) {
    const sample: SearchHealthReport = {
      healthy: false,
      ranAt: new Date().toISOString(),
      checks: [],
      failures: [
        {
          name: "[TEST] case-insensitive search (broward)",
          pass: false,
          detail: "This is a TEST alert to confirm delivery — the search is actually fine.",
        },
      ],
    };
    const ok = await sendSearchHealthAlert(sample);
    console.log(ok ? "✅ TEST alert email sent — check the inbox" : "❌ TEST alert failed to send");
    process.exit(ok ? 0 : 1);
  }

  console.log("\n🔎 Search health check (live MLS feed)\n");
  const report = await runSearchHealthChecks();
  for (const c of report.checks) {
    console.log(`${c.pass ? "✅" : "❌"} ${c.name.padEnd(48)} ${c.detail}`);
  }
  console.log("\n" + "=".repeat(72));

  if (!report.healthy) {
    console.log(`❌ ${report.failures.length} of ${report.checks.length} search checks FAILED`);
    if (args.includes("--alert")) {
      const ok = await sendSearchHealthAlert(report);
      console.log(ok ? "📧 alert email sent to team inbox" : "⚠️  alert email failed to send");
    }
    process.exit(1);
  }

  console.log(`✅ All ${report.checks.length} search checks passed`);
  process.exit(0);
}

main().catch((err) => {
  console.error("search-health crashed:", err);
  process.exit(2);
});

export {};
