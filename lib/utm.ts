// Captures UTM/referrer/landing-page from the current browser context.
// Returns undefined fields when nothing is set so the API can omit them.

import type { CSSProperties } from "react";

export type UtmContext = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  referrer?: string;
  landing?: string;
};

export function captureUtm(): UtmContext {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => {
    const v = params.get(k);
    return v ? v.slice(0, 120) : undefined;
  };
  return {
    source: get("utm_source"),
    medium: get("utm_medium"),
    campaign: get("utm_campaign"),
    content: get("utm_content"),
    term: get("utm_term"),
    referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
    landing: window.location.href.slice(0, 500),
  };
}

// CSS for the honeypot field — visually hidden but technically rendered.
export const HONEYPOT_STYLE: CSSProperties = {
  position: "absolute",
  left: "-10000px",
  top: "auto",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  opacity: 0,
  pointerEvents: "none",
};
