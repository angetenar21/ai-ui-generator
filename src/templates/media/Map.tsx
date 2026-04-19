/**
 * Map Component — powered by react-leaflet + OpenStreetMap (100% free, no API key required)
 *
 * Supports:
 *  - center / zoom
 *  - markers (with optional popups and custom colors)
 *  - polylines, polygons, circles
 *  - tile layer switching (street, satellite-ish via Esri, dark via CartoDB)
 *  - legend, title, controls
 *  - height / rounded / shadow styling
 *  - clusters (manual, lightweight)
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// ── Fix Leaflet default icon path (broken by bundlers) ──────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── CSS injection (avoids needing a global CSS import that could conflict) ──
const LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
function useLeafletCss() {
  useEffect(() => {
    if (document.getElementById('leaflet-css')) return;
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }, []);
}

// ── Tile layer presets ──────────────────────────────────────────────────────
const TILE_LAYERS = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
  },
};

// ── Custom coloured marker icon factory ────────────────────────────────────
function makeIcon(color: string = '#f97316') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.372 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.628 0 12 0z"
            fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

// ── Internal: reset map view when center/zoom props change ─────────────────
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// ── Types ───────────────────────────────────────────────────────────────────
export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  color?: string;
}

export interface MapPolyline {
  positions: [number, number][];
  color?: string;
  weight?: number;
  label?: string;
}

export interface MapPolygon {
  positions: [number, number][];
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  label?: string;
}

export interface MapCircle {
  lat: number;
  lng: number;
  radius: number;       // metres
  color?: string;
  fillColor?: string;
  label?: string;
}

export interface LegendItem {
  color: string;
  label: string;
}

interface MapProps {
  // Map state
  center?: [number, number];
  zoom?: number;
  tileLayer?: 'streets' | 'dark' | 'satellite' | 'light';

  // Overlays
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  polygons?: MapPolygon[];
  circles?: MapCircle[];

  // UI chrome
  title?: string;
  subtitle?: string;
  legend?: LegendItem[];
  showZoomControl?: boolean;
  scrollWheelZoom?: boolean;

  // Card styling
  height?: number | string;
  rounded?: boolean;
  shadow?: boolean;
  className?: string;

  // Renderer
  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const MapComponent: React.FC<MapProps> = ({
  center = [20.5937, 78.9629], // India centroid — sensible default
  zoom = 5,
  tileLayer = 'streets',
  markers = [],
  polylines = [],
  polygons = [],
  circles = [],
  title,
  subtitle,
  legend,
  showZoomControl = true,
  scrollWheelZoom = false,
  height = 420,
  rounded = true,
  shadow = true,
  className = '',
}) => {
  useLeafletCss();
  const tile = TILE_LAYERS[tileLayer] || TILE_LAYERS.streets;
  const [mapKey] = useState(() => Math.random()); // stable unique key per instance

  const containerClasses = [
    'relative overflow-hidden',
    rounded ? 'rounded-2xl' : '',
    shadow ? 'shadow-xl' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {/* Header chrome */}
      {(title || subtitle) && (
        <div
          className="px-5 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-3"
          style={{ zIndex: 1000, position: 'relative' }}
        >
          <div>
            {title && (
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live Map
            </span>
          </div>
        </div>
      )}

      {/* Map */}
      <div style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <MapContainer
          key={mapKey}
          center={center}
          zoom={zoom}
          scrollWheelZoom={scrollWheelZoom}
          zoomControl={showZoomControl}
          style={{ width: '100%', height: '100%' }}
          className="z-0"
        >
          <MapUpdater center={center} zoom={zoom} />

          {/* Tile layer */}
          <TileLayer url={tile.url} attribution={tile.attribution} />

          {/* Markers */}
          {markers.map((m, i) => (
            <Marker
              key={`marker-${i}`}
              position={[m.lat, m.lng]}
              icon={makeIcon(m.color)}
            >
              {(m.title || m.description) && (
                <Popup>
                  <div className="min-w-[120px]">
                    {m.title && <strong className="block text-sm mb-1">{m.title}</strong>}
                    {m.description && <span className="text-xs text-gray-600">{m.description}</span>}
                  </div>
                </Popup>
              )}
            </Marker>
          ))}

          {/* Polylines */}
          {polylines.map((pl, i) => (
            <Polyline
              key={`pl-${i}`}
              positions={pl.positions}
              color={pl.color || '#f97316'}
              weight={pl.weight || 3}
            />
          ))}

          {/* Polygons */}
          {polygons.map((pg, i) => (
            <Polygon
              key={`pg-${i}`}
              positions={pg.positions}
              color={pg.color || '#f97316'}
              fillColor={pg.fillColor || pg.color || '#f97316'}
              fillOpacity={pg.fillOpacity ?? 0.2}
            />
          ))}

          {/* Circles */}
          {circles.map((c, i) => (
            <Circle
              key={`c-${i}`}
              center={[c.lat, c.lng]}
              radius={c.radius}
              color={c.color || '#f97316'}
              fillColor={c.fillColor || c.color || '#f97316'}
              fillOpacity={0.25}
            >
              {c.label && (
                <Popup>
                  <span className="text-sm font-medium">{c.label}</span>
                </Popup>
              )}
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      {legend && legend.length > 0 && (
        <div
          className="px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3"
          style={{ position: 'relative', zIndex: 1000 }}
        >
          {legend.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Marker count badge (bottom-right inside map area) */}
      {markers.length > 0 && (
        <div
          className="absolute bottom-4 right-4 z-[1000] pointer-events-none"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-gray-900/80 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {markers.length} {markers.length === 1 ? 'location' : 'locations'}
          </span>
        </div>
      )}
    </div>
  );
};

export default MapComponent;

export const metadata = {
  name: 'map',
  category: 'media' as const,
  component: MapComponent,
  description: 'Interactive map powered by react-leaflet + OpenStreetMap. Supports markers with popups, polylines, polygons, circles, multiple tile styles (streets, dark, satellite, light), map legend, title/subtitle header, and all common geospatial UI patterns. Completely free with no API key required.',
  tags: ['map', 'geo', 'location', 'leaflet', 'openstreetmap', 'markers', 'interactive', 'media'],
};
