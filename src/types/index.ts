export type SystemStatus = 'healthy' | 'warning' | 'fault';

export interface SensorData {
  timestamp: string;
  tempWinding: number;
  tempBearing: number;
  tempAmbient: number;
  vibration: number;
  current: number;
  voltage: number;
  pressure: number;
  flowRate: number;
  speed: number;
  waterLevel: number;
  oilQuality: number;
  mechanicalHealth: number;
  electricalHealth: number;
  hydraulicHealth: number;
  overallHealth: number;
  pumpEfficiency: number;
  powerConsumption: number;
  status: SystemStatus;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: 'warning' | 'fault';
  message: string;
  acknowledged: boolean;
  source: 'tempWinding' | 'tempBearing' | 'tempAmbient' | 'current' | 'speed' | 'system';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  event: string;
  user?: string;
  level: 'info' | 'warn' | 'error';
}

export interface DeviceStatus {
  plcBrand: string;
  protocol: string;
  esp32: 'online' | 'offline';
  plc: 'online' | 'offline';
  database: 'online' | 'offline';
}

export interface Prediction {
  component: string;
  probabilityOfFailure: number; // 0 to 1
  estimatedDaysRemaining: number;
  recommendation: string;
}

export type PumpState = 'running' | 'stopped' | 'error';
export type PumpMode = 'auto' | 'manual';
