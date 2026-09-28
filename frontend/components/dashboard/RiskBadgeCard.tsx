'use client';

import React from 'react';
import { RiskAssessment } from '../../types';
import { getRiskColor } from '../../lib/utils';
import { ShieldAlert } from 'lucide-react';

interface RiskBadgeCardProps {
  risk?: RiskAssessment;
}

export default function RiskBadgeCard({ risk }: RiskBadgeCardProps) {
  if (!risk) return null;

  const style = getRiskColor(risk.level);
  const scorePct = Math.round(risk.score);

  return (
    <div className={`p-5 rounded-xl border ${style.border} ${style.bg} ${style.glow} backdrop-blur-md relative overflow-hidden transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
            Hyperlocal Convective Threat
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h2 className={`text-2xl font-black uppercase tracking-tight ${style.text}`}>
              {risk.level} RISK
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 font-bold text-slate-200">
              {scorePct}% Score
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <ShieldAlert className={`h-6 w-6 ${style.text}`} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Primary Threat:</span>
          <span className="font-bold text-amber-400 uppercase">{risk.primary_threat}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono mt-1">
          <span className="text-slate-400">Model Confidence:</span>
          <span className="font-bold text-cyan-400">{Math.round(risk.confidence * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
