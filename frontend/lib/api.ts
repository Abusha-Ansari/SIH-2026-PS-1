import {
  NowcastResponse,
  StormCell,
  LightningObservationResponse,
  RiskAssessment,
  Alert,
  ReplayFrame,
  SystemStatusResponse,
  ApiResponse
} from '../types';

const rawApiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = rawApiBase.replace(/\/+$/, '');

async function fetchJson<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, String(val));
      }
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success || json.data === null) {
    throw new Error(json.error?.message || 'Failed to fetch data');
  }
  return json.data;
}

export const thunderApi = {
  getNowcast: async (scenarioId?: string, timeOffsetMin = 0): Promise<NowcastResponse> => {
    return fetchJson<NowcastResponse>('/api/v1/nowcast/live', {
      scenario_id: scenarioId,
      time_offset_min: timeOffsetMin
    });
  },

  getStorms: async (scenarioId?: string): Promise<StormCell[]> => {
    return fetchJson<StormCell[]>('/api/v1/storms/cells', scenarioId ? { scenario_id: scenarioId } : undefined);
  },

  getLightning: async (scenarioId?: string): Promise<LightningObservationResponse> => {
    return fetchJson<LightningObservationResponse>('/api/v1/lightning/live', scenarioId ? { scenario_id: scenarioId } : undefined);
  },

  getRisk: async (scenarioId?: string): Promise<RiskAssessment> => {
    return fetchJson<RiskAssessment>('/api/v1/risk/assessment', scenarioId ? { scenario_id: scenarioId } : undefined);
  },

  getAlerts: async (scenarioId?: string): Promise<Alert[]> => {
    return fetchJson<Alert[]>('/api/v1/alerts/active', scenarioId ? { scenario_id: scenarioId } : undefined);
  },

  getReplayFrame: async (step = 0): Promise<ReplayFrame> => {
    return fetchJson<ReplayFrame>('/api/v1/replay/frame', { step });
  },

  getSystemStatus: async (): Promise<SystemStatusResponse> => {
    return fetchJson<SystemStatusResponse>('/api/v1/system/status');
  }
};
