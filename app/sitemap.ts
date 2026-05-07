import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://leorealtycapitalinvestments.com";

const STATIC_ROUTES = [
  { path: "", priority: 1.0, changeFreq: "daily" as const },
  { path: "/about", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/properties", priority: 0.9, changeFreq: "daily" as const },
  { path: "/services", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/loan-programs", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/team", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/testimonials", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/promotions", priority: 0.7, changeFreq: "weekly" as const },
  { path: "/blog", priority: 0.7, changeFreq: "weekly" as const },
  { path: "/contact", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFreq: "yearly" as const },
  { path: "/fair-housing", priority: 0.3, changeFreq: "yearly" as const },
];

function localePath(locale: string, path: string): string {
  if (locale === routing.defaultLocale) {
    return `${SITE_URL}${path || "/"}`;
  }
  return `${SITE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: localePath(locale, route.path),
        lastModified: now,
        changeFrequency: route.changeFreq,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alt) => [alt, localePath(alt, route.path)])
          ),
        },
      });
    }
  }

  // Programmatic neighborhood pages — one per (locale × neighborhood)
  for (const n of NEIGHBORHOODS) {
    for (const locale of routing.locales) {
      const path = `/neighborhoods/${n.slug}`;
      entries.push({
        url: localePath(locale, path),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alt) => [alt, localePath(alt, path)])
          ),
        },
      });
    }
  }

  return entries;
}
