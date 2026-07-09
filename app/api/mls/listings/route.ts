import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProperty, type MlsListing } from "@/lib/mls";

export const dynamic = "force-dynamic";

const schema = z.object({
  keys: z.array(z.string().min(4).max(64)).min(1).max(100),
});

/**
 * Batch listing lookup by ListingKey — powers the My List page. Missing keys
 * (sold/expired listings) are reported so the UI can fall back to snapshots.
 */
export async function POST(req: NextRequest) {
  let keys: string[];
  try {
    keys = schema.parse(await req.json()).keys;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const listings: MlsListing[] = [];
  const missing: string[] = [];

  // Modest concurrency to stay friendly with the feed.
  const CONCURRENCY = 8;
  for (let i = 0; i < keys.length; i += CONCURRENCY) {
    const chunk = keys.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(chunk.map((k) => getProperty(k)));
    results.forEach((r, idx) => {
      if (r.status === "fulfilled" && r.value) listings.push(r.value);
      else missing.push(chunk[idx]);
    });
  }

  return NextResponse.json({ listings, missing });
}
