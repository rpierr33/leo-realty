import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { db, listingReactions } from "@/lib/db";
import { eq, isNull, and } from "drizzle-orm";
import { sendReactionTeamAlert, type ReactionItem } from "@/lib/reaction-notify";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://leorealtycapitalinvestments.com";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!token || token.length < 16) {
    return NextResponse.redirect(`${SITE_URL}/my-list?claimed=invalid`);
  }

  const rows = await db
    .select()
    .from(listingReactions)
    .where(eq(listingReactions.verifyToken, token))
    .limit(200);

  if (!rows.length) {
    return NextResponse.redirect(`${SITE_URL}/my-list?claimed=invalid`);
  }

  const email = rows[0].email;
  const firstVerification = rows.some((r) => !r.verifiedAt);

  if (firstVerification) {
    await db
      .update(listingReactions)
      .set({ verifiedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(listingReactions.verifyToken, token), isNull(listingReactions.verifiedAt)));

    // Admin awareness: the team hears about a verified interest list the
    // moment it exists — idempotent because re-visiting the link skips this.
    const items: ReactionItem[] = rows.map((r) => ({
      listingKey: r.listingKey,
      reaction: r.reaction,
      address: r.addressSnapshot,
      price: r.priceSnapshot,
      city: r.citySnapshot,
    }));
    after(async () => {
      await sendReactionTeamAlert({ email, items });
    });
  }

  const locale = rows[0].locale && rows[0].locale !== "en" ? `/${rows[0].locale}` : "";
  return NextResponse.redirect(
    `${SITE_URL}${locale}/my-list?claimed=1&token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
  );
}
