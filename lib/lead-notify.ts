// Brevo transactional email — internal alert + prospect autoresponder.
// Fire-and-forget: never throws, never blocks the lead insert.

type Locale = "en" | "fr" | "ht";

type LeadForEmail = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  message?: string | null;
  source?: string | null;
  assignedAgentName?: string | null;
};

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const BREVO_TIMEOUT_MS = 8_000;

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

async function brevoSend(payload: Record<string, unknown>): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[lead-notify] BREVO_API_KEY not set — skipping email send");
    return;
  }
  const keyDebug = `len=${apiKey.length} head=${apiKey.slice(0, 14)} tail=${apiKey.slice(-6)}`;
  console.log(`[lead-notify] starting send. ${keyDebug}`);
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
      const body = await res.text().catch(() => "");
      console.error(`[lead-notify] Brevo ${res.status} body=${body} sender=${(payload as { sender?: { email?: string } }).sender?.email ?? "?"} keyDebug=${keyDebug}`);
    } else {
      console.log(`[lead-notify] Brevo OK ${res.status}`);
    }
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "AbortError" ? `timeout after ${BREVO_TIMEOUT_MS}ms` : err;
    console.error("[lead-notify] Brevo fetch failed:", reason);
  } finally {
    clearTimeout(timeout);
  }
}

export async function notifyTeam(lead: LeadForEmail): Promise<void> {
  const sender = {
    email: process.env.BREVO_SENDER_EMAIL || "noreply@leorealtycapitalinvestments.com",
    name: process.env.BREVO_SENDER_NAME || "Leo Realty Site",
  };
  const to = (process.env.LEAD_NOTIFY_EMAIL || "Info@leorealtycapitalinvestments.com")
    .split(",")
    .map((e) => ({ email: e.trim() }))
    .filter((r) => r.email);

  const fullName = `${lead.firstName} ${lead.lastName}`.trim() || "Unknown";
  const interest = lead.interest.charAt(0).toUpperCase() + lead.interest.slice(1);
  const subject = `New Lead: ${fullName} — ${interest}`;

  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://leorealtycapitalinvestments.com"}/admin/leads/${lead.id}`;

  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0A1628">
      <div style="border-left:3px solid #C5A55A;padding-left:16px;margin-bottom:24px">
        <div style="color:#C5A55A;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700">New Lead</div>
        <h1 style="margin:6px 0 0 0;font-size:22px;font-weight:700">${escape(fullName)}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#6b7280;width:130px">Email</td><td style="padding:8px 0"><a href="mailto:${escape(lead.email)}" style="color:#0A1628">${escape(lead.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td style="padding:8px 0"><a href="tel:${escape(lead.phone)}" style="color:#0A1628">${escape(lead.phone)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Interest</td><td style="padding:8px 0">${escape(interest)}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Source</td><td style="padding:8px 0">${escape(lead.source || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Assigned</td><td style="padding:8px 0">${escape(lead.assignedAgentName || "Unassigned")}</td></tr>
      </table>
      ${
        lead.message
          ? `<div style="margin-top:20px;padding:16px;background:#F8F7F4;border-radius:10px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escape(lead.message)}</div>`
          : ""
      }
      <div style="margin-top:28px">
        <a href="${escape(adminUrl)}" style="display:inline-block;background:#0A1628;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View in Admin →</a>
      </div>
      <p style="margin-top:24px;color:#9ca3af;font-size:12px">Speed-to-lead matters: studies show contacting within 5 minutes raises qualification odds 21×.</p>
    </div>
  `.trim();

  await brevoSend({
    sender,
    to,
    subject,
    htmlContent,
    replyTo: { email: lead.email, name: fullName },
    tags: ["lead-internal-alert"],
  });
}

const AUTORESPONDER_COPY: Record<Locale, { subject: string; greeting: (n: string) => string; body: string; signoff: string }> = {
  en: {
    subject: "We received your inquiry — Leo Realty",
    greeting: (n) => `Hi ${n},`,
    body: "Thanks for reaching out to Leo Realty Capital Investments. A member of our South Florida team will get back to you within one business hour. If your need is urgent, call us directly at (305) 705-2030.",
    signoff: "— The Leo Realty Team",
  },
  fr: {
    subject: "Nous avons bien reçu votre demande — Leo Realty",
    greeting: (n) => `Bonjour ${n},`,
    body: "Merci d'avoir contacté Leo Realty Capital Investments. Un membre de notre équipe en Floride du Sud vous répondra dans l'heure suivante (jours ouvrables). Pour toute urgence, appelez-nous au (305) 705-2030.",
    signoff: "— L'équipe Leo Realty",
  },
  ht: {
    subject: "Nou resevwa demann ou — Leo Realty",
    greeting: (n) => `Bonjou ${n},`,
    body: "Mèsi paske w kontakte Leo Realty Capital Investments. Yon manm ekip nou nan Sid Florid pral reponn ou nan yon èdtan ouvrab. Si sa w bezwen an ijan, rele nou dirèkteman nan (305) 705-2030.",
    signoff: "— Ekip Leo Realty",
  },
};

export async function sendAutoresponder(lead: LeadForEmail, locale: Locale = "en"): Promise<void> {
  if (!lead.email) return;
  const copy = AUTORESPONDER_COPY[locale] ?? AUTORESPONDER_COPY.en;
  const sender = {
    email: process.env.BREVO_SENDER_EMAIL || "noreply@leorealtycapitalinvestments.com",
    name: process.env.BREVO_SENDER_NAME || "Leo Realty Capital Investments",
  };

  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px;color:#0A1628;line-height:1.6">
      <div style="border-bottom:1px solid #e5e7eb;padding-bottom:18px;margin-bottom:22px">
        <div style="color:#C5A55A;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700">Leo Realty Capital Investments</div>
        <div style="color:#9ca3af;font-size:12px;margin-top:4px">North Miami Beach, FL · Since 1992</div>
      </div>
      <p style="margin:0 0 14px;font-size:15px">${escape(copy.greeting(lead.firstName || "there"))}</p>
      <p style="margin:0 0 18px;font-size:15px">${escape(copy.body)}</p>
      <p style="margin:0;font-size:14px;color:#6b7280">${escape(copy.signoff)}</p>
      <div style="margin-top:24px;padding-top:18px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af">
        909 N Miami Beach Blvd, Suite 301A · North Miami Beach, FL 33162 · (305) 705-2030
      </div>
    </div>
  `.trim();

  await brevoSend({
    sender,
    to: [{ email: lead.email, name: `${lead.firstName} ${lead.lastName}`.trim() || undefined }],
    subject: copy.subject,
    htmlContent,
    tags: ["lead-autoresponder", `locale-${locale}`],
  });
}
