import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Exclude API, Next internals, admin, files with extensions, and Next.js
    // metadata routes (sitemap.xml, robots.txt, opengraph-image, etc.)
    // The (?:.*?/)? lets per-locale metadata routes (/fr/opengraph-image,
    // /ht/opengraph-image) bypass the i18n routing too.
    "/((?!api|_next|_vercel|admin|sitemap\\.xml|robots\\.txt|llms\\.txt|manifest\\.json|.*\\..*|(?:[a-z]{2}/)?(?:opengraph-image|twitter-image|icon|apple-icon)).*)",
  ],
};
