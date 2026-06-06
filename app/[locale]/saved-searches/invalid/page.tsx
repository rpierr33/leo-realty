import { Link } from "@/i18n/navigation";

export default function InvalidPage() {
  return (
    <div className="pt-24 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-playfair text-2xl font-bold text-[#0A1628] mb-3">Link expired or invalid</h1>
        <p className="text-[#6B7280] mb-6 text-sm">
          The saved-search link you opened is no longer valid. You can start a new search and re-save
          it from any results page.
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
