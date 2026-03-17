"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MistoMapItem = {
  id: string;
  nazev: string;
  adresa: string | null;
  lat: number | null;
  lng: number | null;
  typ: "pobocka_sazkovky" | "kasino";
  sazkovka?: { nazev: string; slug: string; affiliate_url_registrace: string | null } | null;
  kasino?: { nazev: string; slug: string; affiliate_url: string | null } | null;
};

const DEFAULT_CENTER: [number, number] = [49.8175, 15.473]; // ČR
const DEFAULT_ZOOM = 7;

function FitBounds({ items }: { items: MistoMapItem[] }) {
  const map = useMap();
  const valid = items.filter((m) => m.lat != null && m.lng != null);
  if (valid.length === 0) return null;
  if (valid.length === 1) {
    map.setView([valid[0].lat!, valid[0].lng!], 14);
    return null;
  }
  const bounds = L.latLngBounds(valid.map((m) => [m.lat!, m.lng!]));
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  return null;
}

export function MapaMista({ mista }: { mista: MistoMapItem[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const valid = mista.filter((m) => m.lat != null && m.lng != null);
  const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
        Načítám mapu…
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {valid.length > 0 && <FitBounds items={mista} />}
        {valid.map((m) => (
          <Marker key={m.id} position={[m.lat!, m.lng!]} icon={icon}>
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-semibold">{m.nazev}</p>
                {m.adresa && <p className="text-sm text-gray-600">{m.adresa}</p>}
                {(m.sazkovka?.affiliate_url_registrace || m.kasino?.affiliate_url) && (
                  <p className="mt-2">
                    <a
                      href={m.sazkovka?.affiliate_url_registrace ?? m.kasino?.affiliate_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Zaregistruj se online, než tam půjdeš
                    </a>
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
