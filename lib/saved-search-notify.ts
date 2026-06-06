// Brevo transactional email for saved-search verification + new-listing alerts.

import type { MlsListing } from "@/lib/mls";
import { formatPriceUSD, deriveListingLabel } from "@/lib/mls";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const BREVO_TIMEOUT_MS = 8_000;

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

async function brevoSend(payload: Record<string, unknown>): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[saved-search-notify] BREVO_API_KEY not set — skipping send");
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BREVO_TIMEOUT_MS);
  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = (await res.text().catch(() => "")).slice(0, 500);
      console.error(`[saved-search-notify] Brevo ${res.status} body=${body}`);
    }
  } catch (err) {
    console.error("[saved-search-notify] Brevo fetch failed:", err);
  } finally {
    clearTimeout(timeout);
  }
}

const SENDER = {
  email: process.env.BREVO_SENDER_EMAIL || "noreply@leorealtycapitalinvestments.com",
  name: process.env.BREVO_SENDER_NAME || "Leo Realty Capital Investments",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://leorealtycapitalinvestments.com";

export async function sendVerifyEmail(opts: {
  email: string;
  searchName: string;
  token: string;
}): Promise<void> {
  const verifyUrl = `${SITE_URL}/api/saved-searches/verify/${encodeURIComponent(opts.token)}`;

  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px;color:#0A1628;line-height:1.6">
      <div style="border-bottom:1px solid #e5e7eb;padding-bottom:18px;margin-bottom:22px">
        <div style="color:#C5A55A;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700">Leo Realty Capital Investments</div>
        <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:700">Confirm your saved search</h1>
      </div>
      <p style="margin:0 0 14px;font-size:15px">You asked us to save this search and email you when new matching listings hit the Miami MLS:</p>
      <div style="margin:0 0 22px;padding:14px 18px;background:#FAF8F5;border-left:3px solid #C5A55A;border-radius:6px;font-weight:600">${escape(opts.searchName)}</div>
      <p style="margin:0 0 22px;font-size:15px">Click below to confirm and start getting alerts. You can unsubscribe anytime from any email.</p>
      <p style="margin:0 0 24px"><a href="${escape(verifyUrl)}" style="display:inline-block;background:#0A1628;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Confirm saved search →</a></p>
      <p style="margin:0;font-size:12px;color:#9ca3af">If you didn't ask for this, ignore this email — no search will be saved without your confirmation.</p>
    </div>
  `.trim();

  await brevoSend({
    sender: SENDER,
    to: [{ email: opts.email }],
    subject: `Confirm your saved search — Leo Realty`,
    htmlContent,
    tags: ["saved-search-verify"],
  });
}

export async function sendListingAlertEmail(opts: {
  email: string;
  searchName: string;
  searchId: number;
  listings: MlsListing[];
  manageToken: string;
}): Promise<void> {
  const manageUrl = `${SITE_URL}/saved-searches/${encodeURIComponent(opts.manageToken)}`;
  const unsubscribeUrl = `${SITE_URL}/api/saved-searches/unsubscribe/${encodeURIComponent(
    opts.manageToken
  )}?id=${opts.searchId}`;

  const cards = opts.listings
    .slice(0, 5)
    .map((l) => {
      const img = l.photos[0]?.url;
      const title = l.unparsedAddress ?? [l.city, l.stateOrProvince].filter(Boolean).join(", ") ?? "Listing";
      const price = formatPriceUSD(l.listPrice, l.isLease);
      const label = deriveListingLabel(l);
      const specs = [
        l.bedrooms ? `${l.bedrooms} bd` : null,
        l.bathroomsTotal ? `${l.bathroomsTotal} ba` : null,
        l.livingArea ? `${l.livingArea.toLocaleString()} sqft` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      const url = `${SITE_URL}/properties/${encodeURIComponent(l.listingKey)}`;
      return `
        <a href="${escape(url)}" style="display:block;text-decoration:none;color:#0A1628;margin-bottom:18px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff">
          ${img ? `<img src="${escape(img)}" alt="" style="width:100%;height:200px;object-fit:cover;display:block"/>` : ""}
          <div style="padding:16px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px">
              <span style="background:#C5A55A;color:#0A1628;font-size:10px;font-weight:700;padding:3px 8px;border-radius:99px;text-transform:uppercase">${escape(label)}</span>
              <span style="color:#C5A55A;font-weight:700;font-size:18px">${escape(price)}</span>
            </div>
            <div style="font-weight:600;font-size:15px;margin-bottom:4px">${escape(title)}</div>
            <div style="color:#6b7280;font-size:13px">${escape(specs)}</div>
          </div>
        </a>
      `;
    })
    .join("");

  const more = opts.listings.length > 5 ? `<p style="text-align:center;margin:18px 0 0;color:#6b7280;font-size:13px">+ ${opts.listings.length - 5} more new matches — <a href="${escape(manageUrl)}" style="color:#0A1628;font-weight:600">view all on the site</a></p>` : "";

  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:28px;color:#0A1628;background:#FAF8F5">
      <div style="border-bottom:1px solid #e5e7eb;padding-bottom:18px;margin-bottom:24px">
        <div style="color:#C5A55A;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700">Leo Realty Capital Investments</div>
        <h1 style="margin:8px 0 4px 0;font-size:22px;font-weight:700">New matches for ${escape(opts.searchName)}</h1>
        <p style="margin:0;color:#6b7280;font-size:13px">${opts.listings.length} new listing${opts.listings.length === 1 ? "" : "s"} just hit the MLS</p>
      </div>
      ${cards}
      ${more}
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center">
        <a href="${escape(manageUrl)}" style="color:#6b7280;margin-right:14px">Manage your saved searches</a>
        <a href="${escape(unsubscribeUrl)}" style="color:#6b7280">Unsubscribe from this search</a>
      </div>
    </div>
  `.trim();

  await brevoSend({
    sender: SENDER,
    to: [{ email: opts.email }],
    subject: `${opts.listings.length} new match${opts.listings.length === 1 ? "" : "es"} for "${opts.searchName}"`,
    htmlContent,
    tags: ["listing-alert"],
  });
}
