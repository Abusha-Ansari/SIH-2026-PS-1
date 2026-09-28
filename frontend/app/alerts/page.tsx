'use client';

import React, { useState, useEffect } from 'react';
import { thunderApi } from '../../lib/api';
import { Alert } from '../../types';
import { ShieldAlert, MapPin, Clock } from 'lucide-react';
import { getRiskColor, formatISTDateTime } from '../../lib/utils';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    thunderApi.getAlerts().then((res) => {
      if (mounted) {
        setAlerts(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  if (loading) {
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
            <ShieldAlert className="h-5 w-5 text-red-400" />
            OPERATIONAL DISASTER & NOWCAST BULLETINS ({alerts.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard Common Alerting Protocol (CAP) compliant convective storm warnings
          </p>
        </div>
        <div className="text-right font-mono text-xs text-emerald-400 font-bold">
          NDMA/SDMA DISPATCH: ACTIVE
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const risk = getRiskColor(alert.severity);

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border ${risk.border} bg-slate-950/70 backdrop-blur space-y-3`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyan-400">{alert.id}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${risk.border} ${risk.bg} ${risk.text}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase">
                      Type: {alert.type}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{alert.title}</h2>
                </div>

                <div className="text-right text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>Expires: {formatISTDateTime(alert.expires_at)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {alert.message}
              </p>

              {alert.action_instructions && alert.action_instructions.length > 0 && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-1">
                  <span className="font-mono font-bold">PUBLIC INSTRUCTIONS: </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {alert.action_instructions.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  Target: {alert.region_name} (Radius: {alert.radius_km} km)
                </span>
                <span>ETA: {alert.eta_minutes ? `${alert.eta_minutes} min` : 'Immediate'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
