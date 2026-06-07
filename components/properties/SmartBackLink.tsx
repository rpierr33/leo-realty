"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, List } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Smart back navigation for the property detail page.
 *
 * - If the user came from a same-origin page (homepage, a curated section,
 *   or the grid), "Back" calls router.back() so they land exactly where
 *   they were — list position preserved by the browser.
 * - If there's no usable referrer (direct link, new tab, deep-link from
 *   email/search), we fall back to navigating to /properties.
 * - The "Browse all properties" link is always visible as a secondary
 *   option so the user can choose to jump to the full search.
 */
export default function SmartBackLink({
  backLabel,
  browseAllLabel,
}: {
  backLabel: string;
  browseAllLabel: string;
}) {
  const router = useRouter();
  const [hasInternalReferrer, setHasInternalReferrer] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    try {
      const ref = document.referrer;
      if (!ref) return;
      const refUrl = new URL(ref);
      if (refUrl.origin === window.location.origin) {
        setHasInternalReferrer(true);
      }
    } catch {
      // bad referrer URL — leave as fallback
    }
  }, []);

  function onBack(e: React.MouseEvent) {
    if (hasInternalReferrer && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
    // else: let the <Link> fallback navigate to /properties
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8">
      <Link
        href="/properties"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A55A] transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>
      <span className="text-gray-300">·</span>
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A55A] transition-colors text-sm"
      >
        <List className="w-4 h-4" />
        {browseAllLabel}
      </Link>
    </div>
  );
}
