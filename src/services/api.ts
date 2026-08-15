import type { SensorData, SystemLog, SystemStatus } from '../types';

// Helper to automatically find the backend on the same network
export const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
    if (window.location.hostname.includes('github.io')) {
      return "http://localhost:5000";
    }
    return `http://${window.location.hostname}:5000`;
  }
  return "http://localhost:5000";
};

function computeHealthStatus(speed: number, current: number, tempWinding: number, vibration: number): { status: SystemStatus, overallHealth: number } {
  let status: SystemStatus = 'healthy';
  let overallHealth = 1.0;

  if (speed === 0 && current === 0) {
    overallHealth = 1.0; 
  } else if (speed === 0 && current > 1.0) {
    status = 'fault';
    overallHealth = 0.1;
  } else {
    // 1.0 is perfectly healthy, 0.0 is failure.
    // Temperature: nominal is around 40-45, bad is >55
    const tHealth = 1.0 - Math.max(0, Math.min(1, (tempWinding - 40) / 15));
    // Current: nominal is ~3.45, bad is >5.0
    const cHealth = 1.0 - Math.max(0, Math.min(1, Math.abs(current - 3.45) / 1.5));
    // Speed: nominal is ~1350, bad is < 1000 or > 1600
    const sHealth = 1.0 - Math.max(0, Math.min(1, Math.abs(speed - 1350) / 400));
    // Vibration: nominal is < 2000, bad is > 3000
    const vHealth = 1.0 - Math.max(0, Math.min(1, vibration / 4000));

    overallHealth = (tHealth * 0.25) + (cHealth * 0.25) + (sHealth * 0.25) + (vHealth * 0.25);

    if (overallHealth < 0.6) status = 'fault';
    else if (overallHealth < 0.8) status = 'warning';
  }
  return { status, overallHealth };
}

const defaultSensorData: SensorData = {
  timestamp: new Date().toISOString(),
  tempWinding: 0,
  tempBearing: 0,
  tempAmbient: 0,
  current: 0,
  speed: 0,
  vibration: 0,
  voltage: 0,
  pressure: 0,
  flowRate: 0,
  waterLevel: 0,
  oilQuality: 0,
  mechanicalHealth: 0,
  electricalHealth: 0,
  hydraulicHealth: 0,
  overallHealth: 0,
  pumpEfficiency: 0,
  powerConsumption: 0,
  status: 'healthy'
};

function mapToSensorData(item: any): SensorData {
  const tempWinding = item.temperature !== undefined ? item.temperature : 0;
  const current = item.current !== undefined ? item.current : 0;
  const speed = item.speed !== undefined ? item.speed : 0;
  const vibration = item.vibration !== undefined ? item.vibration : 0;

  const tempBearing = tempWinding > 0 ? tempWinding - 2.5 : 0;
  const tempAmbient = tempWinding > 0 ? 32.0 : 0;

  const { status, overallHealth } = computeHealthStatus(speed, current, tempWinding, vibration);

  return {
    ...defaultSensorData,
    timestamp: item.createdAt || new Date().toISOString(),
    tempWinding,
    tempBearing,
    tempAmbient,
    speed,
    current,
    vibration,
    mechanicalHealth: overallHealth,
    electricalHealth: overallHealth,
    hydraulicHealth: overallHealth,
    overallHealth: overallHealth,
    pumpEfficiency: speed > 0 ? 82.5 + (overallHealth * 5) : 0,
    powerConsumption: speed > 0 ? current * 400 * 1.732 / 1000 : 0,
    status
  };
}

function generateMockHistory(): SensorData[] {
  const mockData: SensorData[] = [];
  const now = new Date();
  
  for (let i = 100; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3000).toISOString();
    mockData.push(mapToSensorData({
      createdAt: timestamp,
      temperature: 42 + (Math.random() - 0.5) * 2,
      current: 3.8 + (Math.random() - 0.5) * 0.2,
      speed: 1450 + (Math.random() - 0.5) * 20,
      vibration: 1800 + (Math.random() - 0.5) * 200
    }));
  }
  return mockData;
}

export const apiService = {
  getLatestData: async (): Promise<SensorData | null> => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data && Object.keys(data).length > 0) {
        return mapToSensorData(data);
      }
      return null;
    } catch (error) {
      console.error("Error fetching latest data:", error);
      return null;
    }
  },

  getHistory: async (_limit: number = 100): Promise<SensorData[]> => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        return data.map(item => mapToSensorData(item));
      }
      return generateMockHistory();
    } catch (error) {
      console.error("Error fetching history:", error);
      return generateMockHistory();
    }
  },

  postData: async (_data: SensorData): Promise<void> => {
    return Promise.resolve();
  },

  sendCommand: async (command: string): Promise<void> => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error sending command: ${command}`, error);
    }
  },

  getLogs: async (_limit: number = 100): Promise<SystemLog[]> => {
    return Promise.resolve([]);
  }
};
