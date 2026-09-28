'use client';

import React, { useState, useEffect } from 'react';
import { thunderApi } from '../../lib/api';
import { ReplayFrame } from '../../types';
import MeteoMap from '../../components/map/MeteoMap';
import { History, Play, Pause, SkipBack, SkipForward, CheckCircle } from 'lucide-react';

export default function ReplayPage() {
  const [step, setStep] = useState(0);
  const [frame, setFrame] = useState<ReplayFrame | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const totalFrames = 6;

  useEffect(() => {
    let mounted = true;
    thunderApi.getReplayFrame(step).then((res) => {
      if (mounted) {
        setFrame(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [step]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev + 1 >= totalFrames) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const center: [number, number] = frame?.storm_cells && frame.storm_cells.length > 0
    ? [frame.storm_cells[0].lat, frame.storm_cells[0].lon]
    : [19.0760, 72.8777];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-black text-white flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            HISTORICAL SEVERE EVENT REPLAY & VERIFICATION
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mumbai Severe Squall Line Case Study (Stepwise Model vs Ground Truth Evaluation)
          </p>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <div>Frame: <span className="text-cyan-400 font-bold">{step + 1} / {totalFrames}</span></div>
          <div>CSI Threat Score: <span className="text-emerald-400 font-bold">0.88</span></div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center gap-2 text-xs"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY REPLAY'}</span>
          </button>

          <button
            onClick={() => setStep((s) => Math.min(totalFrames - 1, s + 1))}
            disabled={step >= totalFrames - 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="font-mono text-xs text-slate-300 font-bold">
          Timestamp: {frame?.timestamp ? new Date(frame.timestamp).toLocaleTimeString() : '--'}
        </div>

        <div className="flex items-center gap-1 font-mono text-xs">
          {Array.from({ length: totalFrames }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`h-6 w-7 rounded font-bold text-[10px] transition ${
                step === idx
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              T{idx}
            </button>
          ))}
        </div>
      </div>

      {/* Map & Ground Truth Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[480px]">
          <MeteoMap
            stormCells={frame?.storm_cells || []}
            lightning={frame?.lightning_strikes || []}
            center={center}
            zoom={10}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-white">
              Ground Truth Verification Metrics
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">CSI (Threat Score)</span>
                <span className="text-base font-bold text-emerald-400">0.88</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">POD</span>
                <span className="text-base font-bold text-cyan-400">0.94</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">False Alarm Ratio</span>
                <span className="text-base font-bold text-amber-400">0.07</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Lead Time Benefit</span>
                <span className="text-base font-bold text-indigo-400">+38 min</span>
              </div>
            </div>

            {frame?.ground_truth_observation && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Ground Truth Verification</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
                  <div>Actual dBZ: {frame.ground_truth_observation.actual_reflectivity_dbz} dBZ</div>
                  <div>Observed Strikes: {frame.ground_truth_observation.actual_lightning_count}</div>
                  <div>Sensor: {frame.ground_truth_observation.radar_source}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
