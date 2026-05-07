import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

// Node.js runtime (default). Next.js automatically generates one OG image
// per locale because of the [locale] dynamic segment.
export const alt = "Leo Realty Capital Investments";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = routing.locales.includes(locale as "en" | "fr" | "ht")
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "OgImage" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #07101F 0%, #0A1628 50%, #030810 100%)",
          padding: "80px",
          color: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "60px",
            top: 0,
            bottom: 0,
            width: "2px",
            background: "linear-gradient(to bottom, transparent, #C5A55A, transparent)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "60px" }}>
          <div style={{ width: "12px", height: "12px", background: "#C5A55A", borderRadius: "50%", display: "flex" }} />
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#C5A55A",
              display: "flex",
            }}
          >
            {t("overline")}
          </div>
        </div>

        <div
          style={{
            fontSize: "84px",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex" }}>{t("headline1")}</div>
          <div style={{ display: "flex", color: "#C5A55A" }}>{t("headline2")}</div>
        </div>

        <div
          style={{
            fontSize: "26px",
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "880px",
            display: "flex",
          }}
        >
          {t("subcopy")}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            right: "80px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "20px", color: "#C5A55A", fontWeight: 600, display: "flex" }}>
              leorealtycapitalinvestments.com
            </div>
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", display: "flex" }}>
              {t("footer")}
            </div>
          </div>
          <div
            style={{
              padding: "16px 32px",
              background: "#C5A55A",
              color: "#0A1628",
              fontSize: "20px",
              fontWeight: 700,
              borderRadius: "999px",
              display: "flex",
            }}
          >
            {t("cta")}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
