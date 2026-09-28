'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { thunderApi } from '../../lib/api';
import { NowcastResponse, ForecastHorizonMap } from '../../types';
import { Clock, Zap, CloudRain, Shield } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';

export default function ForecastPage() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get('scenario') || 'scenario-severe';

  const [data, setData] = useState<NowcastResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const horizons: { key: keyof ForecastHorizonMap; minutes: number }[] = [
    { key: '15min', minutes: 15 },
    { key: '30min', minutes: 30 },
    { key: '45min', minutes: 45 },
    { key: '60min', minutes: 60 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-black text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-400" />
            60-MINUTE STEPWISE CONVECTIVE NOWCAST
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated deep-learning time-extrapolation at 15-minute lead horizons
          </p>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <div>Confidence: <span className="text-cyan-400 font-bold">{Math.round((data.risk_assessment?.confidence || 0.9) * 100)}%</span></div>
          <div>Location: <span className="text-slate-200">{data.target_location?.name || 'Regional Radar Grid'}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {horizons.map(({ key, minutes }) => {
          const item = data.forecast[key];
          if (!item) return null;
          const risk = getRiskColor(item.storm_intensity || 'MODERATE');

          return (
            <div
              key={key}
              className={`p-5 rounded-xl border ${risk.border} bg-slate-950/70 backdrop-blur space-y-4 shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-black text-cyan-400">+{minutes} MIN</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${risk.border} ${risk.bg} ${risk.text}`}>
                  {item.storm_intensity || 'MODERATE'}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-400" /> Lightning Probability
                  </span>
                  <span className="font-mono font-bold text-slate-100">
                    {Math.round(item.lightning_probability * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-cyan-400" /> Storm Probability
                  </span>
                  <span className="font-mono font-bold text-slate-100">
                    {Math.round(item.thunderstorm_probability * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CloudRain className="h-4 w-4 text-blue-400" /> Rain Intensity
                  </span>
                  <span className="font-mono font-bold text-slate-100">{item.rain_intensity_mmh} mm/h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
