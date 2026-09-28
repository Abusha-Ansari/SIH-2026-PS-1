'use client';

import React from 'react';
import { StormCell } from '../../types';
import { CloudRain, Navigation } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';

interface StormCellListProps {
  cells: StormCell[];
  onSelectCell?: (cell: StormCell) => void;
}

export default function StormCellList({ cells = [], onSelectCell }: StormCellListProps) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
          <CloudRain className="h-4 w-4 text-cyan-400" />
          Tracked Convective Cells ({cells.length})
        </h3>
        <span className="text-[10px] font-mono text-slate-400">DWR Tracking Active</span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {cells.map((cell) => {
          const risk = getRiskColor(cell.intensity_level || cell.risk_level);

          return (
            <div
              key={cell.id}
              onClick={() => onSelectCell && onSelectCell(cell)}
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-white">
                  {cell.id} {cell.name ? `- ${cell.name}` : ''}
                </span>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${risk.border} ${risk.bg} ${risk.text}`}>
                  {cell.intensity_level || cell.risk_level}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Peak dBZ</span>
                  <span className="font-bold text-amber-400">{cell.intensity_dbz} dBZ</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Speed</span>
                  <span>{cell.speed_kmh} km/h</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Echo Top</span>
                  <span>{cell.top_altitude_km ? `${cell.top_altitude_km} km` : 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Navigation className="h-2.5 w-2.5 rotate-45 text-cyan-400" />
                  Heading {cell.direction_deg}° ({cell.direction_cardinal})
                </span>
                <span className="text-cyan-400 font-bold">{Math.round(cell.lightning_probability * 100)}% Lightning</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
