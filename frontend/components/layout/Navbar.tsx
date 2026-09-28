'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Zap,
  Clock,
  CloudRain,
  ShieldAlert,
  History,
  Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Live Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Nowcast Map', href: '/nowcast', icon: Zap },
  { label: '60-Min Forecast', href: '/forecast', icon: Clock },
  { label: 'Storm Cells', href: '/storms', icon: CloudRain },
  { label: 'Disaster Alerts', href: '/alerts', icon: ShieldAlert },
  { label: 'Historical Replay', href: '/replay', icon: History },
  { label: 'System Health', href: '/system', icon: Activity },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scenario = searchParams.get('scenario');

  return (
    <aside className="w-56 border-r border-slate-800 bg-slate-950/60 backdrop-blur flex flex-col justify-between p-3 shrink-0">
      <nav className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
          Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const hrefWithQuery = scenario ? `${item.href}?scenario=${scenario}` : item.href;

          return (
            <Link
              key={item.href}
              href={hrefWithQuery}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-cyan-400' : 'text-slate-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-300 font-semibold font-mono">
          <span>AI Engine</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
        <div className="text-[10px] text-slate-400">
          U-Net Convective Forecaster v2.4 (TensorRT)
        </div>
      </div>
    </aside>
  );
}
