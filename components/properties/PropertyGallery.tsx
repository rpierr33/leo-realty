"use client";

import { useCallback, useEffect, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { useTranslations } from "next-intl";

type Photo = { url: string; description: string | null };

/**
 * Browsable MLS photo gallery for the property detail page.
 * - Main viewer with prev/next + a clickable thumbnail strip of ALL photos
 * - Fullscreen lightbox (keyboard ←/→/Esc, click-out to close, body-scroll lock)
 * - Touch swipe on mobile, lazy-loaded thumbnails, a11y labels
 */
export default function PropertyGallery({ images, title }: { images: Photo[]; title: string }) {
  const t = useTranslations("PropertyDetail");
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const count = images.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (count === 0 ? 0 : (i + dir + count) % count)),
    [count]
  );

  // Keyboard nav + body-scroll lock while the lightbox is open.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, go]);

  const [touchX, setTouchX] = useState<number | null>(null);
  const onTouchStart = (e: ReactTouchEvent) => setTouchX(e.touches[0]?.clientX ?? null);
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchX === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    setTouchX(null);
  };

  if (count === 0) {
    return (
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
        <div className="h-80 md:h-96 bg-[#0A1628]/5 flex items-center justify-center">
          <span className="font-playfair text-[#0A1628]/20 text-6xl">L</span>
        </div>
      </div>
    );
  }

  const current = images[index];

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100">
      {/* Main viewer */}
      <div
        className="relative h-80 md:h-[28rem] bg-[#0A1628]/5 group cursor-zoom-in select-none"
        onClick={() => setLightbox(true)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.url} alt={current.description ?? title} className="w-full h-full object-cover" />

        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {t("photoOf", { current: index + 1, total: count })}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightbox(true);
          }}
          aria-label={t("openFullscreen")}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-white/90 text-[#0A1628] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white transition-colors"
        >
          <Expand className="w-3.5 h-3.5" /> {t("viewAllPhotos", { total: count })}
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label={t("prevPhoto")}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0A1628] rounded-full p-2 shadow opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label={t("nextPhoto")}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0A1628] rounded-full p-2 shadow opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip — every photo */}
      {count > 1 && (
        <div className="flex gap-1.5 p-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("photoOf", { current: i + 1, total: count })}
              aria-current={i === index}
              className={`relative flex-shrink-0 h-16 w-24 rounded overflow-hidden ring-2 transition ${
                i === index ? "ring-[#C5A55A]" : "ring-transparent hover:ring-[#C5A55A]/40"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.description ?? `${title} ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setLightbox(false)}
        >
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm font-semibold">{t("photoOf", { current: index + 1, total: count })}</span>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label={t("closeFullscreen")}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.description ?? title}
              className="max-h-full max-w-full object-contain rounded"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={t("prevPhoto")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={t("nextPhoto")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div className="flex gap-1.5 p-3 overflow-x-auto bg-black/40" onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={t("photoOf", { current: i + 1, total: count })}
                  className={`flex-shrink-0 h-14 w-20 rounded overflow-hidden ring-2 transition ${
                    i === index ? "ring-[#C5A55A]" : "ring-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
