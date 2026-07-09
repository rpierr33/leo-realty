// One-shot verification of keyset deep pagination against the live feed.
// Run: set -a; . ./.env.local; set +a; npx tsx scripts/verify-deep-pagination.ts
import { searchProperties } from "../lib/mls";

function keys(l: Awaited<ReturnType<typeof searchProperties>>): string[] {
  return l.listings.map((x) => x.listingKey);
}

async function main() {
  let failures = 0;
  const check = (name: string, pass: boolean, detail: string) => {
    console.log(`${pass ? "✅" : "❌"} ${name} — ${detail}`);
    if (!pass) failures++;
  };

  // 1) Boundary continuity: page 167 (pure $skip) vs page 168 (first hop).
  const p167 = await searchProperties({ statusBucket: "for_sale", top: 60, skip: 9960 });
  const p168 = await searchProperties({ statusBucket: "for_sale", top: 60, skip: 10020 });
  const overlap = keys(p167).filter((k) => keys(p168).includes(k));
  check(
    "page 167→168 hop continuity",
    p167.listings.length === 60 && p168.listings.length === 60 && overlap.length === 0,
    `167:${p167.listings.length} rows, 168:${p168.listings.length} rows, overlap=${overlap.length}`
  );
  const t167 = p167.listings[59]?.modifiedAt ?? "";
  const t168 = p168.listings[0]?.modifiedAt ?? "";
  check(
    "ordering continuity across hop (newest desc)",
    t168 <= t167,
    `last(167)=${t167} first(168)=${t168}`
  );

  // 2) Very deep page (3 hops): skip 30,000 ≈ page 501.
  const deep = await searchProperties({ statusBucket: "for_sale", top: 60, skip: 30000 });
  check(
    "deep page ~501 (3 hops) returns rows",
    deep.listings.length === 60 && deep.total > 30000,
    `${deep.listings.length} rows, total=${deep.total.toLocaleString()}`
  );

  // 3) Sorted hop: price_desc past the ceiling stays monotonic.
  const pd = await searchProperties({ statusBucket: "for_sale", sort: "price_desc", top: 60, skip: 12000 });
  const prices = pd.listings.map((l) => l.listPrice).filter((p): p is number => p !== null);
  let mono = 0;
  for (let i = 1; i < prices.length; i++) if (prices[i] > prices[i - 1]) mono++;
  check(
    "price_desc hop stays sorted",
    pd.listings.length === 60 && mono === 0,
    `${pd.listings.length} rows, order violations=${mono}, first=${prices[0]} last=${prices[prices.length - 1]}`
  );

  // 4) Filtered hop: $150k–$450k band, page ~201 — every row in band.
  const band = await searchProperties({
    statusBucket: "for_sale",
    minPrice: 150_000,
    maxPrice: 450_000,
    top: 60,
    skip: 12000,
  });
  const out = band.listings.filter(
    (l) => l.listPrice !== null && (l.listPrice < 150_000 || l.listPrice > 450_000)
  );
  check(
    "filtered hop (band page ~201) conformance",
    band.listings.length === 60 && out.length === 0 && band.droppedNonConforming === 0,
    `${band.listings.length} rows, out-of-band=${out.length}, total=${band.total.toLocaleString()}`
  );

  // 5) Past-the-end deep request degrades to empty, not an error.
  const past = await searchProperties({
    statusBucket: "for_sale",
    minPrice: 90_000_000,
    top: 60,
    skip: 10_020,
  });
  check("past-the-end hop returns empty page", past.listings.length === 0, `${past.listings.length} rows`);

  console.log(failures === 0 ? "\nALL DEEP-PAGINATION CHECKS PASSED" : `\n${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
