import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "ht", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
