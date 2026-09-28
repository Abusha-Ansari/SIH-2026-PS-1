'use client';

import React from 'react';
import { Alert } from '../../types';
import { BellRing, ChevronRight } from 'lucide-react';
import { getRiskColor } from '../../lib/utils';
import Link from 'next/link';

interface AlertBannerProps {
  alerts: Alert[];
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  if (!alerts || alerts.length === 0) return null;

  const topAlert = alerts[0];
  const risk = getRiskColor(topAlert.severity);

  return (
    <div className={`p-3.5 rounded-xl border ${risk.border} ${risk.bg} flex items-center justify-between gap-4`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-500/20 text-red-400 animate-pulse">
          <BellRing className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-white">
              {topAlert.title}
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-500/30 text-red-300">
              {topAlert.severity}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            {topAlert.message}
          </p>
        </div>
      </div>

      <Link
        href="/alerts"
        className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 shrink-0 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700"
      >
        <span>View All ({alerts.length})</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
