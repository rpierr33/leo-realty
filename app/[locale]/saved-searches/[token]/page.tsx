import { notFound } from "next/navigation";
import { db, savedSearches } from "@/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { Link } from "@/i18n/navigation";
import { BookmarkCheck } from "lucide-react";
import SavedSearchRow from "@/components/properties/SavedSearchRow";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function ManageSavedSearchesPage({ params }: Props) {
  const { token } = await params;
  if (!token || token.length < 16) notFound();

  const ownerRow = await db
    .select({ email: savedSearches.email, verifiedAt: savedSearches.verifiedAt })
    .from(savedSearches)
    .where(eq(savedSearches.verifyToken, token))
    .limit(1);
  if (!ownerRow.length) notFound();

  const email = ownerRow[0].email;
  const verified = !!ownerRow[0].verifiedAt;

  const searches = await db
    .select()
    .from(savedSearches)
    .where(and(eq(savedSearches.email, email), isNull(savedSearches.unsubscribedAt)));

  return (
    <div className="pt-24 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <BookmarkCheck className="w-6 h-6 text-[#C5A55A]" />
            <h1 className="font-playfair text-2xl font-bold text-[#0A1628]">Your saved searches</h1>
          </div>
          <p className="text-sm text-[#6B7280] mb-6">
            {email} — {verified ? "confirmed" : "pending confirmation"}
          </p>

          {searches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#6B7280] mb-4">No saved searches yet.</p>
              <Link
                href="/properties"
                className="inline-flex items-center bg-[#C5A55A] text-[#0A1628] text-sm font-bold px-5 py-2.5 rounded-xl"
              >
                Browse properties
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {searches.map((s) => (
                <SavedSearchRow
                  key={s.id}
                  search={{
                    id: s.id,
                    name: s.name,
                    frequency: s.frequency,
                    verifiedAt: s.verifiedAt?.toISOString() ?? null,
                    paramsJson: s.paramsJson as Record<string, string>,
                  }}
                  token={token}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
