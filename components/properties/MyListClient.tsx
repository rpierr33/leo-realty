"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Heart, PhoneCall, Trash2, MailCheck, BadgeCheck, MapPin } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  getReactions,
  getClaim,
  setClaim,
  setReaction,
  REACTIONS_CHANGED_EVENT,
  REACTION_ORDER,
  type Reaction,
  type ReactionMap,
} from "@/lib/reactions";
import type { MlsListing } from "@/lib/mls";

const GROUP_ICON: Record<Reaction, typeof Heart> = {
  will_contact: PhoneCall,
  loved: Heart,
  interested: Eye,
};

function fmtPrice(value: number | null, isLease?: boolean): string {
  if (value === null || value === undefined || value === 0) return "—";
  const f = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
  return isLease ? `${f}/mo` : f;
}

export default function MyListClient() {
  const t = useTranslations("Reactions");
  const locale = useLocale();
  const [reactions, setReactions] = useState<ReactionMap>({});
  const [live, setLive] = useState<Record<string, MlsListing>>({});
  const [missing, setMissing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [claim, setClaimState] = useState<{ email: string; token: string } | null>(null);
  const [claimStatus, setClaimStatus] = useState<"idle" | "sending" | "sent" | "invalid">("idle");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  // Adopt the magic-link result: /my-list?claimed=1&token=…&email=…
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("claimed") === "1" && sp.get("token") && sp.get("email")) {
      setClaim({ email: sp.get("email")!, token: sp.get("token")! });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (sp.get("claimed") === "invalid") {
      setClaimStatus("invalid");
      window.history.replaceState({}, "", window.location.pathname);
    }
    setClaimState(getClaim());
    const read = () => setReactions(getReactions());
    read();
    window.addEventListener(REACTIONS_CHANGED_EVENT, read);
    return () => window.removeEventListener(REACTIONS_CHANGED_EVENT, read);
  }, []);

  const keys = useMemo(() => Object.keys(reactions), [reactions]);

  useEffect(() => {
    let cancelled = false;
    if (keys.length === 0) {
      setLive({});
      setMissing([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/mls/listings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ keys: keys.slice(0, 100) }),
    })
      .then((r) => r.json())
      .then((d: { listings: MlsListing[]; missing: string[] }) => {
        if (cancelled) return;
        const map: Record<string, MlsListing> = {};
        for (const l of d.listings ?? []) map[l.listingKey] = l;
        setLive(map);
        setMissing(d.missing ?? []);
      })
      .catch(() => !cancelled && setMissing(keys))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join("|")]);

  const submitClaim = useCallback(async () => {
    if (!email.trim() || keys.length === 0) return;
    setClaimStatus("sending");
    try {
      const items = keys.slice(0, 100).map((k) => ({
        listingKey: k,
        reaction: reactions[k].reaction,
        address: live[k]?.unparsedAddress ?? reactions[k].address,
        price: live[k]?.listPrice ?? reactions[k].price,
        city: live[k]?.city ?? reactions[k].city,
      }));
      const res = await fetch("/api/reactions/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale, items, website }),
      });
      setClaimStatus(res.ok ? "sent" : "idle");
    } catch {
      setClaimStatus("idle");
    }
  }, [email, keys, reactions, live, locale, website]);

  const groups = REACTION_ORDER.map((r) => ({
    reaction: r,
    keys: keys
      .filter((k) => reactions[k].reaction === r)
      .sort((a, b) => reactions[b].at - reactions[a].at),
  })).filter((g) => g.keys.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {claim && (
        <div className="mb-6 flex items-center gap-2 bg-[#C5A55A]/10 border border-[#C5A55A]/30 text-[#0A1628] text-sm font-medium px-4 py-3 rounded-xl">
          <BadgeCheck className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
          {t("syncedAs", { email: claim.email })}
        </div>
      )}
      {claimStatus === "invalid" && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {t("claimInvalid")}
        </div>
      )}

      {keys.length === 0 && !loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E4DE]">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-[#6B7280] text-lg mb-2 font-semibold">{t("empty")}</p>
          <Link
            href="/properties"
            className="text-[#C5A55A] font-semibold underline underline-offset-4"
          >
            {t("emptyCta")}
          </Link>
        </div>
      ) : (
        <>
          {groups.map((g) => {
            const Icon = GROUP_ICON[g.reaction];
            return (
              <section key={g.reaction} className="mb-10">
                <h2 className="flex items-center gap-2 font-playfair text-xl font-bold text-[#0A1628] mb-4">
                  <Icon className="w-5 h-5 text-[#C5A55A]" />
                  {t(g.reaction)}
                  <span className="text-sm font-normal text-[#6B7280]">({g.keys.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {g.keys.map((k) => {
                    const l = live[k];
                    const snap = reactions[k];
                    const gone = !l && !loading && missing.includes(k);
                    const image = l?.photos?.[0]?.url;
                    const title = l?.unparsedAddress ?? snap.address ?? k;
                    const location = l
                      ? [l.city, l.stateOrProvince].filter(Boolean).join(", ")
                      : (snap.city ?? "");
                    return (
                      <div
                        key={k}
                        className="bg-white rounded-2xl overflow-hidden border border-[#E8E4DE] flex flex-col"
                      >
                        <Link href={`/properties/${encodeURIComponent(k)}`} className="block relative h-44 bg-[#0A1628]/5">
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-playfair text-[#0A1628]/20 text-4xl">L</span>
                            </div>
                          )}
                          {gone && (
                            <div className="absolute inset-0 bg-[#0A1628]/60 flex items-center justify-center">
                              <span className="bg-white/95 text-[#0A1628] text-xs font-bold px-3 py-1.5 rounded-full">
                                {t("unavailable")}
                              </span>
                            </div>
                          )}
                        </Link>
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="text-[#C5A55A] font-bold text-lg mb-1">
                            {fmtPrice(l?.listPrice ?? snap.price, l?.isLease)}
                          </div>
                          <div className="text-sm font-semibold text-[#0A1628] line-clamp-1 mb-1">{title}</div>
                          <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-4">
                            <MapPin className="w-3 h-3" /> {location || "—"}
                          </div>
                          <div className="mt-auto flex items-center justify-between gap-2">
                            <Link
                              href={`/properties/${encodeURIComponent(k)}`}
                              className="text-xs font-semibold text-[#0A1628] underline underline-offset-4 hover:text-[#C5A55A]"
                            >
                              {t("viewListing")}
                            </Link>
                            <button
                              type="button"
                              onClick={() => setReaction(k, null)}
                              className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> {t("remove")}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {!claim && keys.length > 0 && (
            <section className="bg-[#0A1628] rounded-2xl p-8 mt-4">
              <h2 className="font-playfair text-xl font-bold text-white mb-2">{t("claimTitle")}</h2>
              <p className="text-white/60 text-sm mb-5 max-w-xl">{t("claimBody")}</p>
              {claimStatus === "sent" ? (
                <div className="flex items-center gap-2 text-[#C5A55A] font-semibold text-sm">
                  <MailCheck className="w-5 h-5" /> {t("claimSent")}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("claimEmailPlaceholder")}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/50"
                  />
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    name="website"
                  />
                  <button
                    type="button"
                    disabled={claimStatus === "sending" || !email.includes("@")}
                    onClick={submitClaim}
                    className="bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#D4BA7A] disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {t("claimButton")}
                  </button>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
