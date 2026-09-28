'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { thunderApi } from '../../lib/api';
import { NowcastResponse } from '../../types';
import MeteoMap from '../../components/map/MeteoMap';
import RiskBadgeCard from '../../components/dashboard/RiskBadgeCard';
import ForecastTimeline from '../../components/dashboard/ForecastTimeline';
import ForecastCards from '../../components/dashboard/ForecastCards';
import AIExplanationCard from '../../components/dashboard/AIExplanationCard';
import StormCellList from '../../components/dashboard/StormCellList';
import AlertBanner from '../../components/dashboard/AlertBanner';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get('scenario') || 'scenario-severe';

  const [data, setData] = useState<NowcastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHorizon, setSelectedHorizon] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await thunderApi.getNowcast(scenario, selectedHorizon);
        if (isMounted) {
          setData(res);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch nowcast data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [scenario, selectedHorizon]);

  if (loading && !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-cyan-400">Synthesizing Doppler & Satellite Feeds...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="max-w-md p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-center space-y-3">
          <h3 className="font-mono font-bold text-red-400">Nowcast Service Unavailable</h3>
          <p className="text-xs text-slate-300">{error || 'Could not connect to backend server.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 text-slate-950 font-bold rounded-lg text-xs"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const primaryCenter: [number, number] = data.active_storm_cells.length > 0
    ? [data.active_storm_cells[0].lat, data.active_storm_cells[0].lon]
    : [19.0760, 72.8777];

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto pb-6">
      {/* High-priority Alerts */}
      {data.active_alerts && data.active_alerts.length > 0 && (
        <AlertBanner alerts={data.active_alerts} />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Col: Threat Summary & AI Diagnostics */}
        <div className="space-y-4">
          <RiskBadgeCard risk={data.risk_assessment} />
          
          <AIExplanationCard
            confidence={data.risk_assessment?.confidence}
            factors={data.explanations}
            recommendations={data.risk_assessment?.actionable_recommendations}
          />

          <StormCellList cells={data.active_storm_cells} />
        </div>

        {/* Center & Right Col: Interactive Map & Forecast Timelines */}
        <div className="xl:col-span-2 space-y-4 flex flex-col">
          <div className="h-[480px] w-full">
            <MeteoMap
              stormCells={data.active_storm_cells}
              lightning={data.lightning_observations}
              center={primaryCenter}
              zoom={10}
            />
          </div>

          <ForecastTimeline
            currentHorizon={selectedHorizon}
            onSelectHorizon={setSelectedHorizon}
          />

          <ForecastCards
            forecast={data.forecast}
            selectedHorizon={selectedHorizon}
            onSelect={setSelectedHorizon}
          />
        </div>
      </div>
    </div>
  );
}
