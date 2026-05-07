import type { MetadataRoute } from "next";

const isProd =
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://leorealtycapitalinvestments.com";

export default function robots(): MetadataRoute.Robots {
  if (!isProd) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  // AI crawlers explicitly named so they can cite us in ChatGPT, Claude,
  // Perplexity, Gemini, etc. (GEO — Generative Engine Optimization).
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "Google-Extended",
    "ClaudeBot",
    "Claude-Web",
    "Anthropic-AI",
    "PerplexityBot",
    "Perplexity-User",
    "Applebot-Extended",
    "Bytespider",
    "CCBot",
    "cohere-ai",
    "DiffBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
      },
      ...aiBots.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: ["/admin/", "/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
