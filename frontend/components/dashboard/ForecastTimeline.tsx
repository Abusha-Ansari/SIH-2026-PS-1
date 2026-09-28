'use client';

import React from 'react';
import { Clock, Play, Pause } from 'lucide-react';

interface ForecastTimelineProps {
  currentHorizon: number; // 0, 15, 30, 45, 60
  onSelectHorizon: (horizon: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

const horizons = [0, 15, 30, 45, 60];

export default function ForecastTimeline({
  currentHorizon,
  onSelectHorizon,
  isPlaying = false,
  onTogglePlay
}: ForecastTimelineProps) {
  return (
    <div className="bg-slate-950/80 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {onTogglePlay && (
          <button
            onClick={onTogglePlay}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition"
            title={isPlaying ? 'Pause timeline animation' : 'Play timeline animation'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        )}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span>NOWCAST HORIZON</span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-1 max-w-md justify-center">
        {horizons.map((h) => {
          const isActive = currentHorizon === h;
          return (
            <button
              key={h}
              onClick={() => onSelectHorizon(h)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {h === 0 ? 'NOW' : `+${h}m`}
            </button>
          );
        })}
      </div>

      <div className="text-right hidden sm:block">
        <div className="text-[10px] uppercase font-mono text-slate-400">Step Interval</div>
        <div className="text-xs font-bold text-slate-300 font-mono">15-Min Lead Time</div>
      </div>
    </div>
  );
}
