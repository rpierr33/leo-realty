import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Exclude API, Next internals, admin, files with extensions, and Next.js
    // metadata routes (sitemap.xml, robots.txt, opengraph-image, etc.)
    "/((?!api|_next|_vercel|admin|sitemap\\.xml|robots\\.txt|opengraph-image|twitter-image|icon|apple-icon|manifest\\.json|llms\\.txt|.*\\..*).*)",
  ],
};
