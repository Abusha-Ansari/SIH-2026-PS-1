'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { thunderApi } from '../../lib/api';
import { NowcastResponse } from '../../types';
import MeteoMap from '../../components/map/MeteoMap';
import { Layers, Zap, Wind, CloudRain } from 'lucide-react';

export default function NowcastPage() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get('scenario') || 'scenario-severe';

  const [data, setData] = useState<NowcastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLightning, setShowLightning] = useState(true);
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [showReflectivity, setShowReflectivity] = useState(true);

  useEffect(() => {
    let mounted = true;
    thunderApi.getNowcast(scenario).then((res) => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [scenario]);

  const center: [number, number] = data?.active_storm_cells.length
    ? [data.active_storm_cells[0].lat, data.active_storm_cells[0].lon]
    : [19.0760, 72.8777];

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-3">
      {/* Top Map Control Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold text-white uppercase">
            Full-Screen Nowcast GIS Workbench
          </h2>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowReflectivity(!showReflectivity)}
            className={`px-3 py-1.5 rounded-lg border font-mono font-semibold flex items-center gap-1.5 transition ${
              showReflectivity
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span>Reflectivity Envelopes</span>
          </button>

          <button
            onClick={() => setShowTrajectories(!showTrajectories)}
            className={`px-3 py-1.5 rounded-lg border font-mono font-semibold flex items-center gap-1.5 transition ${
              showTrajectories
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Wind className="h-3.5 w-3.5" />
            <span>Storm Vectors</span>
          </button>

          <button
            onClick={() => setShowLightning(!showLightning)}
            className={`px-3 py-1.5 rounded-lg border font-mono font-semibold flex items-center gap-1.5 transition ${
              showLightning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Lightning Strikes</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 w-full relative">
        <MeteoMap
          stormCells={data?.active_storm_cells || []}
          lightning={data?.lightning_observations}
          center={center}
          zoom={11}
          showLightning={showLightning}
          showTrajectories={showTrajectories}
          showReflectivity={showReflectivity}
        />
      </div>
    </div>
  );
}
