// Brevo emails for listing reactions: visitor magic-link verification and the
// internal "new buyer interest list" alert. Mirrors lib/lead-notify's pattern:
// hard timeout, never throws, send via after() — never awaited in the response
// path.

type Locale = "en" | "fr" | "ht" | "es";

export type ReactionItem = {
  listingKey: string;
  reaction: "interested" | "loved" | "will_contact";
  address: string | null;
  price: number | null;
  city: string | null;
};

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const BREVO_TIMEOUT_MS = 8_000;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://leorealtycapitalinvestments.com";

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

async function brevoSend(payload: Record<string, unknown>): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[reaction-notify] BREVO_API_KEY not set — skipping email send");
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
      const body = (await res.text().catch(() => "")).slice(0, 300);
      console.error(`[reaction-notify] Brevo ${res.status}: ${body}`);
    }
  } catch (err) {
    console.error("[reaction-notify] Brevo send failed:", err);
  } finally {
    clearTimeout(timeout);
  }
}

const REACTION_EN: Record<ReactionItem["reaction"], string> = {
  interested: "Interested",
  loved: "Loved",
  will_contact: "Will contact",
};

const COPY: Record<
  Locale,
  { subject: string; intro: (n: number) => string; cta: string; ignore: string }
> = {
  en: {
    subject: "Confirm your saved property list — Leo Realty",
    intro: (n) => `You saved ${n} propert${n === 1 ? "y" : "ies"} on Leo Realty. Confirm your email to keep your list on any device — and our team will be ready when you are.`,
    cta: "Confirm & open my list",
    ignore: "If this wasn't you, simply ignore this email.",
  },
  fr: {
    subject: "Confirmez votre liste de propriétés — Leo Realty",
    intro: (n) => `Vous avez enregistré ${n} propriété${n === 1 ? "" : "s"} sur Leo Realty. Confirmez votre e-mail pour retrouver votre liste sur tous vos appareils — notre équipe sera prête quand vous le serez.`,
    cta: "Confirmer et ouvrir ma liste",
    ignore: "Si ce n'était pas vous, ignorez simplement cet e-mail.",
  },
  ht: {
    subject: "Konfime lis pwopriyete ou — Leo Realty",
    intro: (n) => `Ou sove ${n} pwopriyete sou Leo Realty. Konfime imèl ou pou kenbe lis ou sou nenpòt aparèy — epi ekip nou an ap pare lè ou pare.`,
    cta: "Konfime epi louvri lis mwen",
    ignore: "Si se pa t ou menm, senpleman inyore imèl sa a.",
  },
  es: {
    subject: "Confirme su lista de propiedades — Leo Realty",
    intro: (n) => `Usted guardó ${n} propiedad${n === 1 ? "" : "es"} en Leo Realty. Confirme su correo para conservar su lista en cualquier dispositivo — y nuestro equipo estará listo cuando usted lo esté.`,
    cta: "Confirmar y abrir mi lista",
    ignore: "Si no fue usted, simplemente ignore este correo.",
  },
};

function fmtPrice(p: number | null): string {
  if (!p) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p);
}

function itemRows(items: ReactionItem[]): string {
  return items
    .slice(0, 12)
    .map(
      (i) =>
        `<tr><td style="padding:7px 10px;border-bottom:1px solid #f0eee9;font-weight:600;color:#0A1628;white-space:nowrap">${esc(
          REACTION_EN[i.reaction]
        )}</td><td style="padding:7px 10px;border-bottom:1px solid #f0eee9;color:#374151">${esc(
          [i.address, i.city].filter(Boolean).join(", ") || i.listingKey
        )}${i.price ? ` — <strong>${esc(fmtPrice(i.price))}</strong>` : ""}</td></tr>`
    )
    .join("");
}

export async function sendReactionVerifyEmail(args: {
  email: string;
  locale: string;
  token: string;
  items: ReactionItem[];
}): Promise<void> {
  const copy = COPY[(args.locale as Locale) in COPY ? (args.locale as Locale) : "en"] ?? COPY.en;
  const verifyUrl = `${SITE_URL}/api/reactions/verify/${encodeURIComponent(args.token)}`;
  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px;color:#0A1628;line-height:1.6">
      <div style="border-left:3px solid #C5A55A;padding-left:16px;margin-bottom:20px">
        <div style="color:#C5A55A;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700">Leo Realty</div>
      </div>
      <p style="margin:0 0 16px;font-size:15px">${esc(copy.intro(args.items.length))}</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #f0eee9;border-radius:8px;overflow:hidden;margin-bottom:20px">${itemRows(args.items)}</table>
      <a href="${esc(verifyUrl)}" style="display:inline-block;background:#0A1628;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${esc(copy.cta)}</a>
      <p style="margin-top:22px;color:#9ca3af;font-size:12px">${esc(copy.ignore)}</p>
    </div>
  `.trim();

  await brevoSend({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL || "noreply@leorealtycapitalinvestments.com",
      name: process.env.BREVO_SENDER_NAME || "Leo Realty Capital Investments",
    },
    to: [{ email: args.email }],
    subject: copy.subject,
    htmlContent,
    tags: ["reaction-verify"],
  });
}

export async function sendReactionTeamAlert(args: {
  email: string;
  items: ReactionItem[];
}): Promise<void> {
  const counts = args.items.reduce(
    (acc, i) => ({ ...acc, [i.reaction]: (acc[i.reaction] ?? 0) + 1 }),
    {} as Record<string, number>
  );
  const summary = (Object.keys(REACTION_EN) as ReactionItem["reaction"][])
    .filter((r) => counts[r])
    .map((r) => `${REACTION_EN[r]}: ${counts[r]}`)
    .join(" · ");
  const to = (process.env.LEAD_NOTIFY_EMAIL || "Info@leorealtycapitalinvestments.com")
    .split(",")
    .map((e) => ({ email: e.trim() }))
    .filter((r) => r.email);

  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#0A1628">
      <div style="border-left:3px solid #C5A55A;padding-left:16px;margin-bottom:20px">
        <div style="color:#C5A55A;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700">Buyer Interest — Verified</div>
        <h1 style="margin:6px 0 0 0;font-size:20px;font-weight:700">${esc(args.email)}</h1>
        <div style="color:#6b7280;font-size:13px;margin-top:4px">${esc(summary)}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #f0eee9;border-radius:8px;overflow:hidden">${itemRows(args.items)}</table>
      <div style="margin-top:24px">
        <a href="${esc(`${SITE_URL}/admin/interests`)}" style="display:inline-block;background:#0A1628;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Open in Admin →</a>
      </div>
      <p style="margin-top:22px;color:#9ca3af;font-size:12px">Speed-to-lead: this visitor just confirmed their email — they expect to hear from Leo Realty.</p>
    </div>
  `.trim();

  await brevoSend({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL || "noreply@leorealtycapitalinvestments.com",
      name: "Leo Realty Site",
    },
    to,
    subject: `🏠 Buyer interest list verified — ${args.email} (${args.items.length} listings)`,
    htmlContent,
    tags: ["reaction-team-alert"],
  });
}
