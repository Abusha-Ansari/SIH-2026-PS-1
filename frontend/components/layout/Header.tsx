'use client';

import React, { useState, useEffect } from 'react';
import { Zap, RefreshCw, Radio, Satellite, ShieldAlert, Cpu } from 'lucide-react';
import { formatISTTime } from '../../lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [time, setTime] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentScenario = searchParams.get('scenario') || 'scenario-severe';

  useEffect(() => {
    const update = () => setTime(formatISTTime(new Date().toISOString()));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScenarioChange = (scenario: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('scenario', scenario);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur px-4 flex items-center justify-between shrink-0 z-30">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Zap className="h-5 w-5 text-cyan-400 fill-cyan-400/20 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-white font-mono">THUNDER-X</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              MoES / IMD Prototype
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Hyperlocal AI Thunderstorm & Lightning Nowcasting</p>
        </div>
      </div>

      {/* Center Controls: Scenario Switcher & Live Sensors */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" /> Scenario:
          </span>
          <select
            value={currentScenario}
            onChange={(e) => handleScenarioChange(e.target.value)}
            aria-label="Operational Scenario"
            className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer border-none"
          >
            <option value="scenario-severe" className="bg-slate-900 text-slate-100">Mumbai Severe Squall Line</option>
            <option value="scenario-developing" className="bg-slate-900 text-slate-100">Pune Developing Supercell</option>
            <option value="scenario-weakening" className="bg-slate-900 text-slate-100">Nagpur Dissipating Convection</option>
            <option value="scenario-multiple" className="bg-slate-900 text-slate-100">Konkan Multi-Cell Cluster</option>
          </select>
        </div>

        {/* Live Feed Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="font-mono text-[11px]">DWR Mumbai (Active)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Satellite className="h-3 w-3" />
            <span className="font-mono text-[11px]">INSAT-3DR 10.8µm</span>
          </div>
        </div>
      </div>

      {/* Right Time & Quick Nowcast Button */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xs text-slate-400 font-mono">IST LIVE TIME</div>
          <div className="text-sm font-mono font-bold text-slate-200 tracking-wider">
            {time || '--:--:--'}
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs shadow-lg shadow-cyan-500/20 transition duration-200"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>RUN NOWCAST</span>
        </button>
      </div>
    </header>
  );
}
