"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { reactionCount, REACTIONS_CHANGED_EVENT } from "@/lib/reactions";

export default function MyListBadge() {
  const t = useTranslations("Nav");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => setCount(reactionCount());
    read();
    window.addEventListener(REACTIONS_CHANGED_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(REACTIONS_CHANGED_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return (
    <Link
      href="/my-list"
      aria-label={t("myList")}
      title={t("myList")}
      className="relative flex items-center p-2 text-white/85 hover:text-[#C5A55A] transition-colors"
    >
      <Heart className={count > 0 ? "w-5 h-5 fill-[#C5A55A] text-[#C5A55A]" : "w-5 h-5"} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-[#C5A55A] text-[#0A1628] text-[10px] font-bold flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
