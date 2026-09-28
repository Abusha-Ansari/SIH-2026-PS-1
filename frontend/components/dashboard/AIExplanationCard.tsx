'use client';

import React from 'react';
import { ExplainableFactor } from '../../types';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';

interface AIExplanationCardProps {
  factors?: ExplainableFactor[];
  confidence?: number;
  recommendations?: string[];
}

export default function AIExplanationCard({
  factors = [],
  confidence = 0.92,
  recommendations = []
}: AIExplanationCardProps) {
  const confPct = Math.round(confidence * 100);

  return (
    <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase font-mono">
              AI Convective Diagnostics & XAI
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">U-Net & Radar Extrapolation</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
          <Sparkles className="h-3 w-3" />
          <span>{confPct}% Confidence</span>
        </div>
      </div>

      {/* Reasoning Points */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Meteorological Triggers
        </div>
        <ul className="space-y-1">
          {factors.map((factor, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex flex-col gap-0.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <div className="flex items-center justify-between font-mono">
                <span className="text-cyan-400 font-bold">{factor.factor_name}</span>
                <span className="text-[10px] text-amber-400">{factor.observed_value} ({factor.threshold})</span>
              </div>
              <p className="text-[11px] text-slate-400">{factor.scientific_summary}</p>
            </li>
          ))}
        </ul>
      </div>

      {recommendations.length > 0 && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
          <div className="flex items-center gap-1 font-bold font-mono">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <span>OPERATIONAL ACTIONS</span>
          </div>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
