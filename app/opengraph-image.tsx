import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Leo Realty Capital Investments — South Florida Real Estate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #07101F 0%, #0A1628 50%, #030810 100%)",
          padding: "80px",
          color: "white",
          position: "relative",
        }}
      >
        {/* Gold vertical accent line */}
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

        {/* Top: brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              background: "#C5A55A",
              borderRadius: "50%",
              display: "flex",
            }}
          />
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
            Leo Realty · MR 2% · 32 Years
          </div>
        </div>

        {/* Headline */}
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
          <div style={{ display: "flex" }}>No One Does</div>
          <div style={{ display: "flex", color: "#C5A55A" }}>It Better.</div>
        </div>

        {/* Subcopy */}
        <div
          style={{
            fontSize: "26px",
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "880px",
            display: "flex",
          }}
        >
          South Florida&apos;s most trusted real estate brokerage — buy, sell,
          rent, finance with the exclusive MR 2% commission.
        </div>

        {/* Bottom row */}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: "20px", color: "#C5A55A", fontWeight: 600, display: "flex" }}>
              leorealtycapitalinvestments.com
            </div>
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", display: "flex" }}>
              (305) 705-2030 · North Miami Beach, FL
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
            Search Properties
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
