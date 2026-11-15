"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeImage } from "@/components/property/PropertyCard";

export function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, prev, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-mist">
        <div
          className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:max-h-[600px]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <SafeImage
            key={images[index]}
            src={images[index]}
            alt={`${title} — photo ${index + 1} of ${images.length}`}
            priority
            sizes="100vw"
            className="transition-opacity duration-300"
          />
        </div>

        <button
          onClick={() => setLightbox(true)}
          className="absolute bottom-4 right-4 flex min-h-[40px] items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <Expand className="h-4 w-4" aria-hidden="true" />
          View photos ({images.length})
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm" aria-live="polite">
              {index + 1} / {images.length}
            </p>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Photo thumbnails">
          {images.map((src, i) => (
            <button
              key={src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                i === index ? "ring-2 ring-ink ring-offset-2" : "opacity-70 hover:opacity-100"
              }`}
            >
              <SafeImage src={src} alt="" sizes="112px" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photo gallery`}
        >
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-5xl"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <SafeImage
                key={images[index]}
                src={images[index]}
                alt={`${title} — photo ${index + 1} of ${images.length}`}
                sizes="100vw"
              />
            </div>
            <p className="mt-4 text-center text-sm text-white/70" aria-live="polite">
              Photo {index + 1} of {images.length} — {title}
            </p>
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
