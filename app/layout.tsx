import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://leorealtycapitalinvestments.com";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Leo Realty Capital Investments | South Florida Real Estate",
    template: "%s | Leo Realty Capital Investments",
  },
  description:
    "Leo Realty Inc — 32 years in business. Buy, sell, rent, and finance your dream home with South Florida's most trusted real estate brokerage. MR 2% | No One Does It Better.",
  keywords: ["real estate", "South Florida", "Miami", "mortgage", "buy home", "sell home", "Leo Realty", "MR 2% commission", "Hometown Heroes Florida"],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/fr",
      ht: "/ht",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ht_HT"],
    url: SITE_URL,
    siteName: "Leo Realty Capital Investments",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <OrganizationJsonLd />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
