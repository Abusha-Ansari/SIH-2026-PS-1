'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import { StormCell, LightningStrike, LightningObservationResponse } from '../../types';

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { duration: 1.2 });
  }, [center, map]);
  return null;
}

interface MapEngineProps {
  stormCells?: StormCell[];
  lightning?: LightningObservationResponse | LightningStrike[];
  center?: [number, number];
  zoom?: number;
  showTrajectories?: boolean;
  showLightning?: boolean;
  showReflectivity?: boolean;
}

export default function MapEngine({
  stormCells = [],
  lightning,
  center = [19.0760, 72.8777],
  zoom = 10,
  showTrajectories = true,
  showLightning = true,
  showReflectivity = true,
}: MapEngineProps) {
  const [activeBase, setActiveBase] = useState<'esri-dark' | 'esri-sat' | 'osm'>('esri-dark');

  const strikes: LightningStrike[] = Array.isArray(lightning)
    ? lightning
    : lightning?.strikes || [];

  const baseLayers = {
    'esri-dark': {
      name: 'Esri Dark Canvas',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16
    },
    'esri-sat': {
      name: 'Satellite Imagery',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri, Maxar, Earthstar Geographics',
      maxZoom: 18
    },
    'osm': {
      name: 'Standard Street',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }
  };

  const getCellColor = (dbz: number) => {
    if (dbz >= 55) return '#ef4444'; // Extreme - Red
    if (dbz >= 45) return '#f97316'; // Severe - Orange
    if (dbz >= 35) return '#eab308'; // Moderate - Yellow
    return '#3b82f6'; // Light - Blue
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Basemap Switcher */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/60 p-1 rounded-lg flex items-center gap-1 shadow-lg">
        {(Object.keys(baseLayers) as Array<keyof typeof baseLayers>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveBase(key)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeBase === key
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {baseLayers[key].name}
          </button>
        ))}
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/60 p-3 rounded-lg text-xs space-y-2 shadow-xl">
        <div className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          Reflectivity (dBZ)
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-blue-500/80 text-white">&lt;35</span>
          <span className="px-1.5 py-0.5 rounded bg-yellow-500/80 text-black">35-45</span>
          <span className="px-1.5 py-0.5 rounded bg-orange-500/80 text-white">45-55</span>
          <span className="px-1.5 py-0.5 rounded bg-red-600/90 text-white">&gt;55 dBZ</span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapController center={center} />
        
        <TileLayer
          url={baseLayers[activeBase].url}
          attribution={baseLayers[activeBase].attribution}
          maxZoom={baseLayers[activeBase].maxZoom}
        />

        {/* Storm Cell Reflectivity Circles */}
        {showReflectivity && stormCells.map((cell) => {
          const color = getCellColor(cell.intensity_dbz);
          const radiusMeters = (cell.radius_km || 10) * 1000;

          return (
            <React.Fragment key={cell.id}>
              <Circle
                center={[cell.lat, cell.lon]}
                radius={radiusMeters}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.35,
                  weight: 2,
                  dashArray: '3, 6'
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <div className="font-bold font-mono text-cyan-400">{cell.id} - {cell.name || 'Convective Core'}</div>
                    <div className="text-slate-300">
                      Severity: <span className="font-semibold uppercase">{cell.intensity_level || cell.risk_level}</span>
                    </div>
                    <div className="text-slate-300">
                      Peak dBZ: <span className="font-semibold text-orange-400">{cell.intensity_dbz} dBZ</span>
                    </div>
                    <div className="text-slate-300">
                      Motion: <span className="font-semibold">{cell.speed_kmh} km/h @ {cell.direction_deg}° ({cell.direction_cardinal})</span>
                    </div>
                    {cell.top_altitude_km && (
                      <div className="text-slate-300">
                        Echo Top: <span className="font-semibold">{cell.top_altitude_km} km</span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Circle>

              {/* Trajectory vector */}
              {showTrajectories && cell.trajectory && cell.trajectory.length > 0 && (
                <Polyline
                  positions={[
                    [cell.lat, cell.lon],
                    ...cell.trajectory.map(p => [p.lat, p.lon] as [number, number])
                  ]}
                  pathOptions={{
                    color: '#38bdf8',
                    weight: 2.5,
                    dashArray: '5, 8',
                    opacity: 0.9
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Live Lightning Strikes */}
        {showLightning && strikes.map((strike) => (
          <CircleMarker
            key={strike.id}
            center={[strike.lat, strike.lon]}
            radius={6}
            pathOptions={{
              color: strike.strike_type === 'CG' ? '#ef4444' : '#38bdf8',
              fillColor: strike.strike_type === 'CG' ? '#fca5a5' : '#7dd3fc',
              fillOpacity: 0.9,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1 text-xs space-y-0.5">
                <div className="font-bold text-amber-400">⚡ {strike.strike_type === 'CG' ? 'Cloud-to-Ground' : 'Intra-Cloud'} ({strike.polarity})</div>
                <div>Current: <span className="font-mono">{strike.peak_current_ka} kA</span></div>
                <div>Time: <span className="font-mono">{new Date(strike.timestamp).toLocaleTimeString()}</span></div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
