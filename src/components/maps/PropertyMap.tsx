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
  const fittedRef = useRef<string>("");
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(11);
  const [clusteredCount, setClusteredCount] = useState(0);

  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  onSelectRef.current = onSelect;
  onHoverRef.current = onHover;

  const selectedRef = useRef(selectedId);
  const hoveredRef = useRef(hoveredId);
  selectedRef.current = selectedId;
  hoveredRef.current = hoveredId;

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
        map.on("zoomend", () => setZoom(map.getZoom()));
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

  /*
   * Marker strategy.
   *
   * Demo listings sit at their locality's approximate centre, so one price label
   * each would stack illegibly. Markers are decluttered by screen position: where
   * two would overlap, a single neighbourhood count is drawn instead, and clicking
   * it zooms in until the advertised prices separate. All coordinates stay
   * illustrative — nothing here implies a real address.
   */
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !ready) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const groupPopup = (group: Property[]) => {
      const rows = group
        .slice(0, 4)
        .map(
          (p) => `<a class="nivora-popup-row" href="/property/${p.id}">
              <strong>${formatPrice(p.price, p.listingType)}</strong>
              <span>${p.title}</span>
            </a>`
        )
        .join("");
      const more =
        group.length > 4
          ? `<span class="nivora-popup-loc">+${group.length - 4} more nearby</span>`
          : "";
      return `<div class="nivora-popup nivora-popup--group">
                <div class="nivora-popup-body">
                  <strong>${group[0].locality}, ${group[0].city}</strong>
                  <span class="nivora-popup-loc">${group.length} demo ${
                    group.length === 1 ? "property" : "properties"
                  } nearby</span>
                  ${rows}${more}
                </div>
              </div>`;
    };

    const addPriceMarker = (p: Property) => {
      const isSelected = p.id === selectedRef.current;
      const isHovered = p.id === hoveredRef.current;
      const icon = L.divIcon({
        className: "nivora-marker-wrap",
        html: `<div class="nivora-marker ${isSelected ? "nivora-marker--selected" : ""} ${
          isHovered ? "nivora-marker--hover" : ""
        }">${formatPrice(p.price, p.listingType)}</div>`,
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
    };

    const addClusterMarker = (group: Property[]) => {
      const lat = group.reduce((a, p) => a + p.lat, 0) / group.length;
      const lng = group.reduce((a, p) => a + p.lng, 0) / group.length;
      const isSelected = group.some((p) => p.id === selectedRef.current);
      const isHovered = group.some((p) => p.id === hoveredRef.current);
      const icon = L.divIcon({
        className: "nivora-marker-wrap",
        html: `<div class="nivora-marker nivora-marker--group ${
          isSelected ? "nivora-marker--selected" : ""
        } ${isHovered ? "nivora-marker--hover" : ""}">${group.length}</div>`,
        iconSize: undefined,
        iconAnchor: [0, 0],
      });
      const marker = L.marker([lat, lng], {
        icon,
        keyboard: true,
        title: `${group.length} demo properties near ${group[0].locality}`,
      });
      marker.on("click", () => {
        if (group.length === 1) onSelectRef.current(group[0].id);
        map.setView([lat, lng], Math.max(map.getZoom() + 2, 15), { animate: true });
      });
      marker.on("mouseover", () => onHoverRef.current(group[0].id));
      marker.on("mouseout", () => onHoverRef.current(null));
      marker.bindPopup(groupPopup(group), { closeButton: false, offset: [0, -6], maxWidth: 280 });
      marker.addTo(map);
      group.forEach((p) => markersRef.current.set(p.id, marker));
    };

    const CELL_W = 96;
    const CELL_H = 32;
    const buckets = new Map<string, Property[]>();
    setClusteredCount(0);

    properties.forEach((p) => {
      const point = map.latLngToContainerPoint([p.lat, p.lng]);
      const key = `${Math.round(point.x / CELL_W)}:${Math.round(point.y / CELL_H)}`;
      buckets.set(key, [...(buckets.get(key) ?? []), p]);
    });

    let clustered = 0;
    buckets.forEach((group) => {
      if (group.length === 1) addPriceMarker(group[0]);
      else {
        clustered += group.length;
        addClusterMarker(group);
      }
    });
    setClusteredCount(clustered);

    // Fit the map to the results only when the result set itself changes — never
    // on zoom, or the user's own navigation would be undone on every zoom step.
    const signature = properties.map((p) => p.id).join(",");
    if (properties.length > 0 && fittedRef.current !== signature) {
      fittedRef.current = signature;
      const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.15), { animate: false });
    }
  }, [properties, ready, zoom]);

  /*
   * Selection and hover only restyle existing markers. Rebuilding them here would
   * close the popup the visitor just opened, so state is applied as classes.
   */
  useEffect(() => {
    const state = new Map<HTMLElement, { selected: boolean; hovered: boolean }>();
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement()?.querySelector<HTMLElement>(".nivora-marker");
      if (!el) return;
      const entry = state.get(el) ?? { selected: false, hovered: false };
      if (id === selectedId) entry.selected = true;
      if (id === hoveredId) entry.hovered = true;
      state.set(el, entry);
    });
    state.forEach((entry, el) => {
      el.classList.toggle("nivora-marker--selected", entry.selected);
      el.classList.toggle("nivora-marker--hover", entry.hovered);
    });
  }, [selectedId, hoveredId]);

  /* Fly to selected property (from card click) */
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !selectedId) return;
    const p = properties.find((x) => x.id === selectedId);
    if (!p) return;
    map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 13), { duration: 0.8 });
    // The zoom change rebuilds markers, so resolve the marker when the popup opens
    // rather than holding a reference that the rebuild will detach from the map.
    window.setTimeout(() => markersRef.current.get(selectedId)?.openPopup(), 850);
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
      <p className="pointer-events-none absolute bottom-2 left-2 right-2 z-[500] mx-auto w-fit max-w-full rounded-full bg-white/90 px-3 py-1 text-center text-[10px] font-medium text-stone2 backdrop-blur-sm">
        {clusteredCount > 0
          ? "Grouped where markers would overlap — zoom in for prices · illustrative locations"
          : "Illustrative demo locations — not exact addresses"}
      </p>
    </div>
  );
}
