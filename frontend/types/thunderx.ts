export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export type AlertSeverity = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type AlertType = 'THUNDERSTORM' | 'LIGHTNING' | 'HEAVY_RAIN' | 'STORM_APPROACHING' | 'HIGH_RISK';

export type ConnectionStatus = 'CONNECTED' | 'DEGRADED' | 'OFFLINE' | 'SIMULATION';

export type DataSourceType = 'RADAR' | 'SATELLITE' | 'LIGHTNING' | 'ATMOSPHERIC' | 'AI_MODEL';

export interface GeoLocation {
  lat: number;
  lon: number;
  name?: string;
}

export interface BoundingBox {
  min_lat: number;
  min_lon: number;
  max_lat: number;
  max_lon: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: ApiError | null;
  timestamp: string;
}

export interface ForecastInterval {
  interval_minutes: number;
  target_timestamp: string;
  thunderstorm_probability: number;
  lightning_probability: number;
  rain_intensity_mmh: number;
  storm_intensity: string;
  confidence: number;
}

export interface ForecastHorizonMap {
  '15min': ForecastInterval;
  '30min': ForecastInterval;
  '45min': ForecastInterval;
  '60min': ForecastInterval;
}

export interface TrajectoryPoint {
  offset_minutes: number;
  timestamp: string;
  lat: number;
  lon: number;
  radius_km: number;
  intensity_dbz: number;
  confidence: number;
}

export interface StormCell {
  id: string;
  name?: string;
  timestamp: string;
  lat: number;
  lon: number;
  intensity_dbz: number;
  intensity_level: string;
  direction_deg: number;
  direction_cardinal: string;
  speed_kmh: number;
  radius_km: number;
  lightning_probability: number;
  risk_level: RiskLevel;
  top_altitude_km?: number;
  trajectory: TrajectoryPoint[];
}

export interface LightningStrike {
  id: string;
  timestamp: string;
  lat: number;
  lon: number;
  peak_current_ka: number;
  strike_type: 'CG' | 'IC';
  polarity: 'POSITIVE' | 'NEGATIVE';
}

export interface LightningDensityGrid {
  lat: number;
  lon: number;
  flash_count_per_sqkm: number;
  risk_level: string;
}

export interface LightningObservationResponse {
  timestamp: string;
  total_strikes_last_15m: number;
  cg_strikes_count: number;
  ic_strikes_count: number;
  strikes: LightningStrike[];
  density_heatmap: LightningDensityGrid[];
}

export interface ExplainableFactor {
  category: 'RADAR' | 'SATELLITE' | 'LIGHTNING' | 'ATMOSPHERIC' | 'TRAJECTORY';
  factor_name: string;
  observed_value: string;
  threshold: string;
  impact_level: 'HIGH' | 'CRITICAL' | 'MODERATE' | 'LOW';
  scientific_summary: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  confidence: number;
  primary_threat: string;
  factors: ExplainableFactor[];
  actionable_recommendations: string[];
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  message: string;
  region_name: string;
  center_lat: number;
  center_lon: number;
  radius_km: number;
  eta_minutes?: number;
  created_at: string;
  expires_at: string;
  action_instructions: string[];
}

export interface DataSourceStatus {
  name: string;
  type: DataSourceType;
  status: ConnectionStatus;
  provider: string;
  latency_ms: number;
  last_updated: string;
  metadata?: Record<string, string>;
}

export interface SystemStatusResponse {
  api_status: string;
  prediction_provider: string;
  demo_mode: boolean;
  active_scenario?: string;
  server_time_utc: string;
  server_time_ist: string;
  data_sources: DataSourceStatus[];
}

export interface ReplayEventMetadata {
  id: string;
  name: string;
  region: string;
  date: string;
  description: string;
  total_frames: number;
  interval_minutes: number;
  start_time: string;
  end_time: string;
  has_ground_truth: boolean;
}

export interface GroundTruthObservation {
  actual_reflectivity_dbz?: number;
  actual_lightning_count?: number;
  radar_source?: string;
}

export interface ReplayFrame {
  frame_index: number;
  timestamp: string;
  storm_cells: StormCell[];
  lightning_strikes: LightningStrike[];
  forecast: ForecastHorizonMap;
  risk: RiskAssessment;
  ground_truth_observation?: GroundTruthObservation;
}

export interface NowcastResponse {
  timestamp: string;
  target_location?: GeoLocation;
  time_offset_min: number;
  forecast: ForecastHorizonMap;
  active_storm_cells: StormCell[];
  lightning_observations: LightningObservationResponse;
  risk_assessment: RiskAssessment;
  active_alerts: Alert[];
  explanations: ExplainableFactor[];
  eta_minutes_to_target?: number;
  distance_km_to_target?: number;
  bearing_to_target?: number;
}
