import { NextResponse } from "next/server";

// TEMPORARY diagnostic endpoint. Calls Brevo /v3/account from the Vercel function
// runtime so we can compare to the same call from a local terminal. Deletes once
// the 401 mystery is resolved.

export async function GET() {
  const apiKey = process.env.BREVO_API_KEY ?? "";
  const sender = process.env.BREVO_SENDER_EMAIL ?? "";
  const senderName = process.env.BREVO_SENDER_NAME ?? "";
  const notify = process.env.LEAD_NOTIFY_EMAIL ?? "";

  const keyMeta = {
    present: Boolean(apiKey),
    length: apiKey.length,
    head: apiKey.slice(0, 14),
    tail: apiKey.slice(-6),
    hasWhitespace: /\s/.test(apiKey),
    isQuoted: apiKey.startsWith('"') || apiKey.startsWith("'"),
  };

  let accountResp: { status: number; body: string } | { error: string };
  try {
    const r = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": apiKey, accept: "application/json" },
    });
    accountResp = { status: r.status, body: (await r.text()).slice(0, 800) };
  } catch (err) {
    accountResp = { error: err instanceof Error ? err.message : String(err) };
  }

  let sendResp: { status: number; body: string } | { error: string };
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify({
        sender: { email: sender, name: senderName },
        to: [{ email: notify || sender }],
        subject: `Diag ping ${Date.now()}`,
        htmlContent: "<p>From /api/diag/brevo on Vercel runtime.</p>",
      }),
    });
    sendResp = { status: r.status, body: (await r.text()).slice(0, 800) };
  } catch (err) {
    sendResp = { error: err instanceof Error ? err.message : String(err) };
  }

  return NextResponse.json({
    keyMeta,
    senderEmail: sender,
    senderName,
    notifyEmail: notify,
    accountResp,
    sendResp,
  });
}
