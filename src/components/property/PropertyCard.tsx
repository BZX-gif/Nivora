"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin, Maximize } from "lucide-react";
import { useState } from "react";
import { LogoSymbol } from "@/components/brand/Logo";
import { useFavourites, useToast } from "@/lib/store";
import { formatArea, formatPrice } from "@/lib/format";
import type { Property } from "@/types/property";

/** Image with a graceful branded fallback if the photo fails to load. */
export function SafeImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-mist ${className}`} role="img" aria-label={alt}>
        <LogoSymbol className="h-10 w-10 text-line" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

interface PropertyCardProps {
  property: Property;
  highlighted?: boolean;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
}

export function PropertyCard({ property: p, highlighted = false, onHover, onSelect }: PropertyCardProps) {
  const { isFav, toggle } = useFavourites();
  const toast = useToast();
  const fav = isFav(p.id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(p.id);
    toast.push(fav ? "Removed from saved properties" : "Saved to your properties");
  };

  return (
    <article
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ease-out ${
        highlighted
          ? "border-ink shadow-lift ring-1 ring-ink"
          : "border-line shadow-card hover:-translate-y-0.5 hover:shadow-lift"
      }`}
    >
      <Link
        href={`/property/${p.id}`}
        onClick={() => onSelect?.(p.id)}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
        aria-label={`View details: ${p.title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-mist">
          <SafeImage
            src={p.images[0]}
            alt={`${p.title} — ${p.locality}, ${p.city}`}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              {p.listingType === "buy" ? "For sale" : "For rent"}
            </span>
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink backdrop-blur-sm">
              {p.category}
            </span>
          </div>
          <button
            onClick={handleFav}
            aria-label={fav ? "Remove from saved properties" : "Save this property"}
            aria-pressed={fav}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
              fav ? "bg-ink text-white" : "bg-white/90 text-ink hover:bg-white"
            }`}
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
          </button>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xl font-semibold tracking-tight text-ink">
              {formatPrice(p.price, p.listingType)}
            </p>
            <span className="shrink-0 text-[11px] font-medium text-muted">{p.advertiser.type}</span>
          </div>
          <h3 className="mt-1.5 line-clamp-1 text-[15px] font-medium text-ink">{p.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-stone2">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {p.locality}, {p.city}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-[13px] text-stone2">
            {p.bedrooms != null && (
              <span className="inline-flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" aria-hidden="true" /> {p.bedrooms} bed
              </span>
            )}
            {p.bathrooms != null && (
              <span className="inline-flex items-center gap-1.5">
                <Bath className="h-4 w-4" aria-hidden="true" /> {p.bathrooms} bath
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="h-3.5 w-3.5" aria-hidden="true" /> {formatArea(p.areaSqft)}
            </span>
            {p.furnishing && <span className="text-muted">{p.furnishing}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
