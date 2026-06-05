export type SystemStatus = 'healthy' | 'warning' | 'fault';

export interface SensorData {
  timestamp: string;
  tempWinding: number; // °C (MAX6675)
  tempBearing: number; // °C (PT100)
  tempAmbient: number; // °C (DB18B20)
  current: number; // Amps
  speed: number; // RPM
  healthIndex: number; // 0.0 to 1.0
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
