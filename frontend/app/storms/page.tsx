'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { thunderApi } from '../../lib/api';
import { StormCell } from '../../types';
import { CloudRain } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';

export default function StormsPage() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get('scenario') || 'scenario-severe';

  const [stormCells, setStormCells] = useState<StormCell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    thunderApi.getStorms(scenario).then((res) => {
      if (mounted) {
        setStormCells(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [scenario]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-black text-white flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-cyan-400" />
            RADAR-TRACKED CONVECTIVE CELLS ({stormCells.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            TITAN/SCIT automated cell identification, tracking, and morphological growth diagnostics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stormCells.map((cell) => {
          const risk = getRiskColor(cell.intensity_level || cell.risk_level);

          return (
            <div
              key={cell.id}
              className={`p-5 rounded-xl border ${risk.border} bg-slate-950/70 backdrop-blur space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-mono font-bold text-white">
                    {cell.id} {cell.name ? `- ${cell.name}` : ''}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Lat: {cell.lat.toFixed(4)}, Lon: {cell.lon.toFixed(4)}
                  </span>
                </div>
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded border ${risk.border} ${risk.bg} ${risk.text}`}>
                  {cell.intensity_level || cell.risk_level}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Peak dBZ</span>
                  <span className="text-sm font-bold text-amber-400">{cell.intensity_dbz} dBZ</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Echo Top</span>
                  <span className="text-sm font-bold text-slate-200">{cell.top_altitude_km ? `${cell.top_altitude_km} km` : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Velocity</span>
                  <span className="text-sm font-bold text-slate-200">{cell.speed_kmh} km/h</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Heading</span>
                  <span className="text-sm font-bold text-cyan-400">{cell.direction_deg}° ({cell.direction_cardinal})</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Radius:</span>
                  <span className="font-semibold font-mono">{cell.radius_km} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lightning Probability:</span>
                  <span className="font-semibold text-amber-400 font-mono">{Math.round(cell.lightning_probability * 100)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
