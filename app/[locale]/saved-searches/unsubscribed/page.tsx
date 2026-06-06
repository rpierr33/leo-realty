import { Link } from "@/i18n/navigation";

export default function UnsubscribedPage() {
  return (
    <div className="pt-24 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-playfair text-2xl font-bold text-[#0A1628] mb-3">Unsubscribed</h1>
        <p className="text-[#6B7280] mb-6 text-sm">
          You won&apos;t receive any more emails for that saved search. You can save a new one anytime.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center bg-[#C5A55A] text-[#0A1628] text-sm font-bold px-5 py-2.5 rounded-xl"
        >
          Browse properties
        </Link>
      </div>
    </div>
  );
}
