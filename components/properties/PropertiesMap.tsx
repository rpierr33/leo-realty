"use client";

import { useEffect, useMemo, useRef } from "react";
import L, { LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapListing {
  listingKey: string;
  listPrice: number | null;
  isLease: boolean;
  city: string | null;
  unparsedAddress: string | null;
  bedrooms: number | null;
  bathroomsTotal: number | null;
  photoUrl: string | null;
  latitude: number;
  longitude: number;
  statusLabel: string;
}

function formatPrice(value: number | null, isLease: boolean): string {
  if (value === null || value === undefined) return "Price on request";
  const f = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
  return isLease ? `${f}/mo` : f;
}

function compactPrice(value: number | null): string {
  if (value === null) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

export default function PropertiesMap({ listings }: { listings: MapListing[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const validListings = useMemo(
    () => listings.filter((l) => Number.isFinite(l.latitude) && Number.isFinite(l.longitude)),
    [listings]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [25.7617, -80.1918], // Miami
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();

    if (validListings.length === 0) return;

    const bounds: LatLngBoundsLiteral = [];

    for (const l of validListings) {
      bounds.push([l.latitude, l.longitude]);

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          background:#0A1628;
          color:#C5A55A;
          font-weight:700;
          font-size:12px;
          padding:6px 10px;
          border-radius:9999px;
          border:2px solid #C5A55A;
          box-shadow:0 4px 12px rgba(0,0,0,0.2);
          white-space:nowrap;
          cursor:pointer;
        ">${compactPrice(l.listPrice)}${l.isLease ? "/mo" : ""}</div>`,
        iconSize: [60, 30],
        iconAnchor: [30, 15],
      });

      const safePhotoUrl = isSafeHttpUrl(l.photoUrl) ? l.photoUrl! : null;
      const photoHtml = safePhotoUrl
        ? `<img src="${escapeHtml(safePhotoUrl)}" alt="" style="width:220px;height:120px;object-fit:cover;border-radius:8px;display:block;margin-bottom:8px"/>`
        : "";
      const specs = [
        l.bedrooms ? `${l.bedrooms} bd` : null,
        l.bathroomsTotal ? `${l.bathroomsTotal} ba` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      const marker = L.marker([l.latitude, l.longitude], { icon }).addTo(layerRef.current!);
      marker.bindPopup(
        `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;width:220px">
          ${photoHtml}
          <div style="font-weight:700;color:#C5A55A;font-size:16px;margin-bottom:2px">${formatPrice(
            l.listPrice,
            l.isLease
          )}</div>
          <div style="font-size:13px;color:#0A1628;font-weight:600;margin-bottom:4px;line-height:1.3">${escapeHtml(
            l.unparsedAddress ?? l.city ?? ""
          )}</div>
          <div style="font-size:11px;color:#6B7280;margin-bottom:8px">${escapeHtml(l.statusLabel)} · ${escapeHtml(specs)}</div>
          <a href="/properties/${encodeURIComponent(l.listingKey)}" style="display:inline-block;background:#0A1628;color:#fff;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600">View details →</a>
        </div>`,
        { maxWidth: 240, closeButton: true }
      );
    }

    if (bounds.length === 1) {
      mapRef.current.setView(bounds[0], 14);
    } else if (bounds.length > 1) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [validListings]);

  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px] rounded-2xl overflow-hidden border border-[#E8E4DE]">
      <div ref={containerRef} className="absolute inset-0" />
      {validListings.length === 0 && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-white/80 backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <p className="text-[#0A1628] font-semibold">No mappable listings</p>
            <p className="text-[#6B7280] text-sm mt-1">
              These results don&apos;t include coordinates. Try widening your search.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

function isSafeHttpUrl(value: string | null): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
