'use client';

import React from 'react';
import { ForecastHorizonMap, ForecastInterval } from '../../types';
import { Zap, CloudRain, Shield } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';

interface ForecastCardsProps {
  forecast?: ForecastHorizonMap;
  selectedHorizon: number;
  onSelect: (minutes: number) => void;
}

export default function ForecastCards({
  forecast,
  selectedHorizon,
  onSelect
}: ForecastCardsProps) {
  if (!forecast) return null;

  const intervals: { key: keyof ForecastHorizonMap; minutes: number }[] = [
    { key: '15min', minutes: 15 },
    { key: '30min', minutes: 30 },
    { key: '45min', minutes: 45 },
    { key: '60min', minutes: 60 }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {intervals.map(({ key, minutes }) => {
        const item: ForecastInterval = forecast[key];
        if (!item) return null;

        const isSelected = selectedHorizon === minutes;
        const riskStyle = getRiskColor(item.storm_intensity || 'MODERATE');
        const probPct = Math.round(item.lightning_probability * 100);
        const thunderProbPct = Math.round(item.thunderstorm_probability * 100);

        return (
          <div
            key={key}
            onClick={() => onSelect(minutes)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              isSelected
                ? 'border-cyan-500 bg-slate-900 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">
                +{minutes} Minutes
              </span>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${riskStyle.border} ${riskStyle.bg} ${riskStyle.text}`}>
                {item.storm_intensity || 'MODERATE'}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400" /> Strike Prob.
                </span>
                <span className="font-mono font-bold text-slate-200">{probPct}%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-cyan-400" /> Storm Prob.
                </span>
                <span className="font-mono font-bold text-slate-200">{thunderProbPct}%</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <CloudRain className="h-3 w-3 text-blue-400" /> Rain Rate
                </span>
                <span className="font-mono font-bold text-slate-200">{item.rain_intensity_mmh} mm/h</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
