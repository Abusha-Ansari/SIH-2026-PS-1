'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { StormCell, LightningObservationResponse, LightningStrike } from '../../types';

const DynamicMap = dynamic(() => import('./MapEngine'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-cyan-400">Loading Geospatial Engine...</span>
      </div>
    </div>
  ),
});

interface MeteoMapProps {
  stormCells?: StormCell[];
  lightning?: LightningObservationResponse | LightningStrike[];
  center?: [number, number];
  zoom?: number;
  showTrajectories?: boolean;
  showLightning?: boolean;
  showReflectivity?: boolean;
}

export default function MeteoMap(props: MeteoMapProps) {
  return <DynamicMap {...props} />;
}
