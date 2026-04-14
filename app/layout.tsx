import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
  title: {
    default: "Leo Realty Capital Investments | South Florida Real Estate",
    template: "%s | Leo Realty Capital Investments",
  },
  description:
    "Leo Realty Inc — 32 years in business. Buy, sell, rent, and finance your dream home with South Florida's most trusted real estate brokerage. MR 2% | No One Does It Better.",
  keywords: ["real estate", "South Florida", "Miami", "mortgage", "buy home", "sell home", "Leo Realty"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://leorealtycapitalinvestments.com",
    siteName: "Leo Realty Capital Investments",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
