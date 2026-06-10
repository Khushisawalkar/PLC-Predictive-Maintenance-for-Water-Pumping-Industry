import type { SensorData, SystemLog, SystemStatus } from '../types';

let mockPumpState: 'running' | 'stopped' | 'error' = 'stopped';
let mockTempWinding = 25.0;
let mockTempBearing = 25.0;
let mockTempAmbient = 25.0;
let mockCurrent = 0.0;
let mockSpeed = 0;

let currentSensorData: SensorData = {
  timestamp: new Date().toISOString(),
  tempWinding: 25.0,
  tempBearing: 25.0,
  tempAmbient: 25.0,
  current: 0.0,
  speed: 0,
  healthIndex: 0.0,
  status: 'healthy'
};

// Start the backend simulation loop
setInterval(() => {
  if (mockPumpState === 'running') {
    let tempSpike = 0;
    let currentSpike = 0;
    
    // Fault simulation
    if (Math.random() > 0.97) {
      tempSpike = Math.random() * 10;
      currentSpike = Math.random() * 8; // Spike up to +8A
    }

    mockTempWinding = Math.max(20, Math.min(100, mockTempWinding + (Math.random() - 0.5) * 2.0 + tempSpike));
    mockTempBearing = Math.max(20, Math.min(80, mockTempBearing + (Math.random() - 0.5) * 1.0 + tempSpike * 0.5));
    mockTempAmbient = Math.max(20, Math.min(45, mockTempAmbient + (Math.random() - 0.5) * 0.2));
    
    // Normal running current around 12A
    if (mockCurrent < 10) mockCurrent += 2; 
    else mockCurrent = Math.max(10, Math.min(30, mockCurrent + (Math.random() - 0.5) * 1.0 + currentSpike));
    
    if (mockSpeed < 1300) {
      mockSpeed = Math.min(1500, mockSpeed + 300);
    } else {
      mockSpeed = Math.max(1300, Math.min(1700, mockSpeed + (Math.random() - 0.5) * 100));
    }
  } else {
    mockTempWinding = Math.max(25, mockTempWinding - 1.5);
    mockTempBearing = Math.max(25, mockTempBearing - 0.8);
    mockTempAmbient = Math.max(25, mockTempAmbient - 0.1);
    mockCurrent = Math.max(0, mockCurrent - 2.0); // drop to 0 quickly
    mockSpeed = 0;
  }

  const tWNorm = Math.max(0, Math.min(1, (mockTempWinding - 20) / 80));
  const tBNorm = Math.max(0, Math.min(1, (mockTempBearing - 20) / 60));
  const cNorm = Math.max(0, Math.min(1, (mockCurrent - 10) / 15)); // Nominally 10A, max 25A 
  const sNorm = Math.max(0, Math.min(1, Math.abs(mockSpeed - 1500) / 1500)); 

  // healthIndex prioritizes Winding Temp and Current
  const healthIndex = (tWNorm * 0.25) + (tBNorm * 0.15) + (cNorm * 0.4) + (sNorm * 0.2);
  
  let status: SystemStatus = 'healthy';
  if (healthIndex > 0.8) status = 'fault';
  else if (healthIndex > 0.6) status = 'warning';

  // EMERGENCY STOP LOGIC: Drastic increases or absolute critical thresholds
  const isWindingSpike = (mockTempWinding - currentSensorData.tempWinding) > 10;
  const isBearingSpike = (mockTempBearing - currentSensorData.tempBearing) > 8;
  const isCurrentSpike = (mockCurrent - currentSensorData.current) > 5;
  const isSpeedSpike = (mockSpeed - currentSensorData.speed) > 500;
  const isCriticalAbsolute = mockTempWinding > 80 || mockTempBearing > 70 || mockCurrent > 22 || mockSpeed > 2800;

  if (isWindingSpike || isBearingSpike || isCurrentSpike || isSpeedSpike || isCriticalAbsolute) {
    status = 'fault';
  }

  if (status === 'fault' && mockPumpState === 'running') {
    mockPumpState = 'error'; // Auto-stop logic built into the backend
  }

  currentSensorData = {
    timestamp: new Date().toISOString(),
    tempWinding: mockTempWinding,
    tempBearing: mockTempBearing,
    tempAmbient: mockTempAmbient,
    current: mockCurrent,
    speed: mockSpeed,
    healthIndex,
    status
  };
}, 1000);

// Helper to automatically find the backend on the same network
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  // If accessed from another device (e.g. 192.168.x.x), assume backend is on the same host
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
    // Check if it's GitHub Pages
    if (window.location.hostname.includes('github.io')) {
      return "http://localhost:5000"; // Will trigger fallback on GitHub Pages
    }
    return `http://${window.location.hostname}:5000`;
  }
  return "http://localhost:5000";
};

export const apiService = {
  getLatestData: async (): Promise<SensorData> => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // If the backend only returns partial data (e.g. from the Temperature model)
      if (data && data.temperature !== undefined) {
        mockTempWinding = data.temperature; // Inject real temp into the simulation loop!
        
        return {
          ...currentSensorData,
          tempWinding: data.temperature,
          timestamp: data.createdAt || currentSensorData.timestamp
        };
      }
      
      // If the backend returns a full SensorData object
      if (data && data.tempWinding !== undefined) {
        return data;
      }

      return currentSensorData;
    } catch (error) {
      console.warn("Backend unavailable, using simulated data");
      return currentSensorData;
    }
  },

  getHistory: async (_limit: number = 100): Promise<SensorData[]> => {
    return Promise.resolve([]);
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
      // Update local state so UI reflects the command
      if (command === 'start') mockPumpState = 'running';
      else if (command === 'stop') mockPumpState = 'stopped';
      else if (command === 'emergency_stop') mockPumpState = 'error';
      else if (command === 'reset') {
        mockPumpState = 'stopped';
        mockTempWinding = 25.0;
        mockTempBearing = 25.0;
        mockTempAmbient = 25.0;
        mockCurrent = 0.0;
        mockSpeed = 0;
      }
    } catch (error) {
      console.warn(`Backend unavailable, simulating command: ${command}`);
      if (command === 'start') mockPumpState = 'running';
      else if (command === 'stop') mockPumpState = 'stopped';
      else if (command === 'emergency_stop') mockPumpState = 'error';
      else if (command === 'reset') {
        mockPumpState = 'stopped';
        mockTempWinding = 25.0;
        mockTempBearing = 25.0;
        mockTempAmbient = 25.0;
        mockCurrent = 0.0;
        mockSpeed = 0;
      }
    }
  },

  getLogs: async (_limit: number = 100): Promise<SystemLog[]> => {
    return Promise.resolve([]);
  }
};
