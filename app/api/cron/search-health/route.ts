import { NextRequest, NextResponse } from "next/server";
import { runSearchHealthChecks, sendSearchHealthAlert } from "@/lib/search-health";

// Scheduled monitor: runs the live MLS search invariants and emails the team
// inbox if any fail. Auth via CRON_SECRET bearer, same as listing-alerts.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Manual verification: ?test=1 forces a sample alert email so you can confirm
  // notifications land, without waiting for a real outage. Auth-gated above.
  if (new URL(req.url).searchParams.get("test") === "1") {
    const alerted = await sendSearchHealthAlert({
      healthy: false,
      ranAt: new Date().toISOString(),
      checks: [],
      failures: [
        {
          name: "[TEST] search monitor",
          pass: false,
          detail: "Manual test trigger — the search is actually fine. This confirms alert delivery.",
        },
      ],
    });
    return NextResponse.json({ ok: true, test: true, alerted });
  }

  const report = await runSearchHealthChecks();

  let alerted = false;
  if (!report.healthy) {
    console.error(
      `[cron/search-health] UNHEALTHY — ${report.failures.length} failure(s):`,
      report.failures.map((f) => `${f.name} (${f.detail})`)
    );
    alerted = await sendSearchHealthAlert(report);
  }

  // 503 on failure so Vercel's cron log + any uptime monitor also flag it.
  return NextResponse.json(
    {
      ok: true,
      healthy: report.healthy,
      alerted,
      ranAt: report.ranAt,
      checks: report.checks,
      failures: report.failures,
    },
    { status: report.healthy ? 200 : 503 }
  );
}
