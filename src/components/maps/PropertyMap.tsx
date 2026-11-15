"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { JAIPUR_CENTER } from "@/data/demo-properties";
import type { Property } from "@/types/property";

interface PropertyMapProps {
  properties: Property[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  className?: string;
}

/**
 * Interactive demo map (Leaflet + OpenStreetMap tiles).
 * Loaded dynamically so map libraries never ship on non-map pages.
 * All coordinates are illustrative demo locations in Jaipur.
 */
export function PropertyMap({
  properties,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  className = "",
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  onSelectRef.current = onSelect;
  onHoverRef.current = onHover;

  /* Initialise map once */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const L = await import("leaflet");
        if (cancelled || !containerRef.current) return;
        leafletRef.current = L;
        const map = L.map(containerRef.current, {
          zoomControl: false,
          scrollWheelZoom: true,
          attributionControl: true,
        }).setView([JAIPUR_CENTER.lat, JAIPUR_CENTER.lng], 11);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);
        mapRef.current = map;
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    const markers = markersRef.current;
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, []);

  /* Rebuild markers when the result set changes */
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !ready) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    properties.forEach((p) => {
      const isSelected = p.id === selectedId;
      const isHovered = p.id === hoveredId;
      const icon = L.divIcon({
        className: "nivora-marker-wrap",
        html: `<div class="nivora-marker ${isSelected ? "nivora-marker--selected" : ""} ${isHovered ? "nivora-marker--hover" : ""}">${formatPrice(p.price, p.listingType)}</div>`,
        iconSize: undefined,
        iconAnchor: [0, 0],
      });
      const marker = L.marker([p.lat, p.lng], { icon, keyboard: true, title: p.title });
      marker.on("click", () => onSelectRef.current(p.id));
      marker.on("mouseover", () => onHoverRef.current(p.id));
      marker.on("mouseout", () => onHoverRef.current(null));
      marker.bindPopup(
        `<div class="nivora-popup">
           <img src="${p.images[0]}" alt="" onerror="this.style.display='none'" />
           <div class="nivora-popup-body">
             <strong>${formatPrice(p.price, p.listingType)}</strong>
             <span>${p.title}</span>
             <span class="nivora-popup-loc">${p.locality}, ${p.city}</span>
             <a href="/property/${p.id}">View details</a>
           </div>
         </div>`,
        { closeButton: false, offset: [0, -6] }
      );
      marker.addTo(map);
      markersRef.current.set(p.id, marker);
    });

    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.15), { animate: false });
    }
  }, [properties, ready, selectedId, hoveredId]);

  /* Fly to selected property (from card click) */
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !selectedId) return;
    const p = properties.find((x) => x.id === selectedId);
    if (!p) return;
    map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 13), { duration: 0.8 });
    const marker = markersRef.current.get(selectedId);
    if (marker) {
      window.setTimeout(() => marker.openPopup(), 850);
    }
  }, [selectedId, properties]);

  if (failed) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-mist p-8 text-center ${className}`} role="status">
        <MapPin className="h-8 w-8 text-muted" aria-hidden="true" />
        <p className="font-medium text-ink">Map unavailable right now</p>
        <p className="max-w-xs text-sm text-stone2">
          The map tiles could not be loaded. You can still browse all properties in the list view.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="absolute inset-0 z-0" aria-label="Interactive map of demo properties in Jaipur" />
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-mist">
          <p className="text-sm text-stone2">Loading map…</p>
        </div>
      )}
      <p className="pointer-events-none absolute bottom-2 left-2 z-[500] rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium text-stone2 backdrop-blur-sm">
        Illustrative demo locations — not exact addresses
      </p>
    </div>
  );
}
