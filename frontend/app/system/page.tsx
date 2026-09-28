'use client';

import React, { useState, useEffect } from 'react';
import { thunderApi } from '../../lib/api';
import { SystemStatusResponse } from '../../types';
import { Activity, CheckCircle2 } from 'lucide-react';

export default function SystemPage() {
  const [data, setData] = useState<SystemStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    thunderApi.getSystemStatus().then((res) => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-black text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            THUNDER-X SYSTEM TELEMETRY & INGESTION HEALTH
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline diagnostics across Doppler radar, INSAT-3DR, and Lightning Detection Networks
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>API: {data.api_status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.data_sources.map((src) => (
          <div
            key={src.name}
            className="p-5 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-sm text-white">{src.name}</span>
                <span className="text-[10px] text-slate-400 block font-mono">{src.type}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                src.status === 'CONNECTED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {src.status}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span>{src.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Latency:</span>
                <span>{src.latency_ms} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Telemetry:</span>
                <span>{new Date(src.last_updated).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
