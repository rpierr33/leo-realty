import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, gte, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { agents, leads } from "@/lib/db/schema";
import { notifyTeam, sendAutoresponder } from "@/lib/lead-notify";
import { pickAgentForLead } from "@/lib/lead-router";

const RATE_LIMIT_PER_EMAIL_WINDOW_SEC = 60;
const RATE_LIMIT_GLOBAL_WINDOW_SEC = 60;
const RATE_LIMIT_GLOBAL_MAX = 30;

const utmSchema = z
  .object({
    source: z.string().max(120).optional(),
    medium: z.string().max(120).optional(),
    campaign: z.string().max(120).optional(),
    content: z.string().max(120).optional(),
    term: z.string().max(120).optional(),
    referrer: z.string().max(500).optional(),
    landing: z.string().max(500).optional(),
  })
  .partial();

const schema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional(),
  name: z.string().max(200).optional(),
  email: z.string().email(),
  phone: z.string().min(10).max(30),
  interest: z.enum(["buying", "selling", "renting", "mortgage", "other"]).default("other"),
  message: z.string().max(4000).optional(),
  source: z.string().max(120).optional(),
  propertyId: z.number().int().positive().optional(),
  locale: z.enum(["en", "fr", "ht"]).default("en"),
  utm: utmSchema.optional(),
  // Honeypot — real users never fill this; bots always do.
  website: z.string().max(500).optional(),
});

function buildSourceTag(base: string | undefined, utm: z.infer<typeof utmSchema> | undefined): string {
  const parts = [base || "contact_form"];
  if (utm?.source) parts.push(`utm_source=${utm.source}`);
  if (utm?.medium) parts.push(`utm_medium=${utm.medium}`);
  if (utm?.campaign) parts.push(`utm_campaign=${utm.campaign}`);
  if (utm?.content) parts.push(`utm_content=${utm.content}`);
  if (utm?.term) parts.push(`utm_term=${utm.term}`);
  return parts.join("|").slice(0, 255);
}

function buildMessage(userMessage: string | undefined, utm: z.infer<typeof utmSchema> | undefined): string {
  const lines: string[] = [];
  if (userMessage) lines.push(userMessage.trim());
  const meta: string[] = [];
  if (utm?.referrer) meta.push(`Referrer: ${utm.referrer}`);
  if (utm?.landing) meta.push(`Landing: ${utm.landing}`);
  if (meta.length) {
    if (lines.length) lines.push("");
    lines.push("---");
    lines.push(...meta);
  }
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  let data: z.infer<typeof schema>;
  try {
    const body = await req.json();
    data = schema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // 1. Honeypot — bots fill the hidden `website` field. Pretend success, don't insert.
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ success: true, message: "Lead created" }, { status: 201 });
  }

  // Normalize name fields
  let firstName = (data.firstName || "").trim();
  let lastName = (data.lastName || "").trim();
  if (!firstName && data.name) {
    const parts = data.name.trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }
  firstName = firstName || "Unknown";

  const email = data.email.toLowerCase().trim();
  const phone = data.phone.replace(/[^\d+]/g, "");

  try {
    // 2. Per-contact dedupe + rate limit: same email or phone in the last minute returns
    //    the existing lead (idempotent for double-click) without re-inserting or re-notifying.
    const dedupeWindow = new Date(Date.now() - RATE_LIMIT_PER_EMAIL_WINDOW_SEC * 1000);
    const recent = await db
      .select({ id: leads.id })
      .from(leads)
      .where(and(or(eq(leads.email, email), eq(leads.phone, phone)), gte(leads.createdAt, dedupeWindow)))
      .limit(1);
    if (recent.length > 0) {
      return NextResponse.json(
        { success: true, message: "Lead already received", id: recent[0].id },
        { status: 200 },
      );
    }

    // 3. Global flood guard: cap site-wide submissions at N per minute.
    const globalWindow = new Date(Date.now() - RATE_LIMIT_GLOBAL_WINDOW_SEC * 1000);
    const [{ floodCount = 0 } = { floodCount: 0 }] = await db
      .select({ floodCount: sql<number>`count(*)::int` })
      .from(leads)
      .where(gte(leads.createdAt, globalWindow));
    if (floodCount >= RATE_LIMIT_GLOBAL_MAX) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(RATE_LIMIT_GLOBAL_WINDOW_SEC) } },
      );
    }

    // 4. Round-robin assignment (least-loaded active realtor).
    const picked = await pickAgentForLead();

    // 5. Atomic insert with assignment in one statement.
    const sourceTag = buildSourceTag(data.source, data.utm);
    const composedMessage = buildMessage(data.message, data.utm);

    const [inserted] = await db
      .insert(leads)
      .values({
        firstName,
        lastName,
        email,
        phone,
        interest: data.interest,
        message: composedMessage || null,
        source: sourceTag,
        status: "new",
        ...(picked ? { assignedAgentId: picked.id } : {}),
        ...(data.propertyId ? { propertyId: data.propertyId } : {}),
      })
      .returning({ id: leads.id });

    // 6. Fire-and-forget notifications. Email failure must NEVER 500 the response.
    const leadForEmail = {
      id: inserted.id,
      firstName,
      lastName,
      email,
      phone,
      interest: data.interest,
      message: composedMessage || null,
      source: sourceTag,
      assignedAgentName: picked?.name ?? null,
    };
    Promise.allSettled([notifyTeam(leadForEmail), sendAutoresponder(leadForEmail, data.locale)]).catch(
      () => {
        // already logged inside helpers
      },
    );

    return NextResponse.json({ success: true, message: "Lead created", id: inserted.id }, { status: 201 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// Avoid unused-import lint noise — `agents` is referenced via Drizzle's relation graph
// during select/join inference; keeping the import here documents the dependency.
void agents;
