"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, PhoneCall } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  getReactions,
  setReaction,
  REACTIONS_CHANGED_EVENT,
  type Reaction,
} from "@/lib/reactions";

const ICONS: Record<Reaction, typeof Heart> = {
  interested: Eye,
  loved: Heart,
  will_contact: PhoneCall,
};

const REACTIONS: Reaction[] = ["interested", "loved", "will_contact"];

type Props = {
  listingKey: string;
  address?: string | null;
  price?: number | null;
  city?: string | null;
  /** "card" = compact icon overlay; "detail" = full labeled chips. */
  variant?: "card" | "detail";
};

export default function ReactionButtons({
  listingKey,
  address = null,
  price = null,
  city = null,
  variant = "card",
}: Props) {
  const t = useTranslations("Reactions");
  const [active, setActive] = useState<Reaction | null>(null);

  useEffect(() => {
    const read = () => setActive(getReactions()[listingKey]?.reaction ?? null);
    read();
    window.addEventListener(REACTIONS_CHANGED_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(REACTIONS_CHANGED_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, [listingKey]);

  const toggle = (r: Reaction) => {
    const next = active === r ? null : r;
    setActive(next);
    setReaction(listingKey, next ? { reaction: next, address, price, city } : null);
  };

  if (variant === "detail") {
    return (
      <div className="flex flex-wrap gap-2" data-reactions={listingKey}>
        {REACTIONS.map((r) => {
          const Icon = ICONS[r];
          const on = active === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => toggle(r)}
              aria-pressed={on}
              className={cn(
                "inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border transition-colors",
                on
                  ? "bg-[#C5A55A] text-[#0A1628] border-[#C5A55A]"
                  : "bg-white text-[#0A1628] border-[#E8E4DE] hover:border-[#C5A55A]/50"
              )}
            >
              <Icon className={cn("w-4 h-4", on && r === "loved" && "fill-[#0A1628]")} />
              {t(r)}
            </button>
          );
        })}
      </div>
    );
  }

  // Card overlay: compact icon buttons. Stop propagation so tapping a
  // reaction never triggers the card's <Link> navigation.
  return (
    <div
      className="absolute top-4 right-4 flex flex-col gap-1.5 z-10"
      data-reactions={listingKey}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {REACTIONS.map((r) => {
        const Icon = ICONS[r];
        const on = active === r;
        return (
          <button
            key={r}
            type="button"
            title={t(r)}
            aria-label={t(r)}
            aria-pressed={on}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(r);
            }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all",
              on
                ? "bg-[#C5A55A] text-[#0A1628] border-[#C5A55A] scale-110"
                : "bg-[#0A1628]/55 text-white border-white/25 hover:bg-[#0A1628]/80 hover:border-[#C5A55A]/60"
            )}
          >
            <Icon className={cn("w-4 h-4", on && r === "loved" && "fill-[#0A1628]")} />
          </button>
        );
      })}
    </div>
  );
}
