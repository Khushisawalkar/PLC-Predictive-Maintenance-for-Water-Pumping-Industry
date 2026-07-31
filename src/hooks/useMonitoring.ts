import { useState, useEffect, useCallback, useRef } from 'react';
import type { SensorData, Alert, SystemLog, DeviceStatus, Prediction, PumpState, PumpMode, SystemStatus } from '../types';
import { apiService } from '../services/api';
const MAX_HISTORY = 1000;
export function useMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [pumpState, setPumpState] = useState<PumpState>('stopped');
  const [pumpMode, setPumpMode] = useState<PumpMode>('manual');

  const [currentData, setCurrentData] = useState<SensorData>({
    timestamp: new Date().toISOString(),
    tempWinding: 0,
    tempBearing: 0,
    tempAmbient: 0,
    vibration: 0,
    current: 0,
    voltage: 0,
    pressure: 0,
    flowRate: 0,
    speed: 0,
    waterLevel: 0,
    oilQuality: 0,
    mechanicalHealth: 0,
    electricalHealth: 0,
    hydraulicHealth: 0,
    overallHealth: 0,
    pumpEfficiency: 0,
    powerConsumption: 0,
    status: 'healthy'
  });

  const [history, setHistory] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', timestamp: new Date().toISOString(), event: 'System Initialized', level: 'info', user: 'System' }
  ]);

  const lastDataRef = useRef<SensorData>(currentData);

  const [pumpRuntime, setPumpRuntime] = useState(0);
  const [systemUptime, setSystemUptime] = useState(0);
  const [lastFaultTimestamp, setLastFaultTimestamp] = useState<string | null>(null);

  const [deviceStatus] = useState<DeviceStatus>({
    plcBrand: ' Nino ',
    protocol: 'OPC UA',
    esp32: 'online',
    plc: 'online',
    database: 'online',
  });

  const [predictions] = useState<Prediction[]>([
    { component: 'Bearing #2', probabilityOfFailure: 0.15, estimatedDaysRemaining: 120, recommendation: 'Schedule routine inspection' },
    { component: 'Impeller', probabilityOfFailure: 0.05, estimatedDaysRemaining: 300, recommendation: 'Normal operation' },
    { component: 'Motor Winding', probabilityOfFailure: 0.02, estimatedDaysRemaining: 500, recommendation: 'Normal operation' }
  ]);

  const addLog = useCallback((event: string, level: 'info' | 'warn' | 'error' = 'info', user = 'System') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      event,
      level,
      user
    }, ...prev].slice(0, 500));
  }, []);

  const addAlert = useCallback((type: 'warning' | 'fault', message: string, source: Alert['source']) => {
    setAlerts(prev => {
      if (prev.length > 0 && prev[0].message === message && !prev[0].acknowledged) return prev;
      addLog(`Alert triggered: ${message}`, type === 'fault' ? 'error' : 'warn');
      return [{
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        type,
        message,
        acknowledged: false,
        source
      }, ...prev];
    });
  }, [addLog]);

  useEffect(() => {
    if (!isMonitoring) return;
    const interval = setInterval(() => {
      setSystemUptime(prev => prev + 1);
      if (pumpState === 'running') {
        setPumpRuntime(prev => prev + 1);
      }
    }, 1000);
    
    // Fetch initial history
    apiService.getHistory().then(initialHistory => {
      if (initialHistory && initialHistory.length > 0) {
        setHistory(initialHistory);
      } else {
        setHistory([]);
      }
    }).catch(console.error);
    
    return () => clearInterval(interval);
  }, [isMonitoring, pumpState]);

  useEffect(() => {
    if (!isMonitoring) return;

    let lastLoggedMinute = new Date().getMinutes();

    const fetchLatest = async () => {
      try {
        const newData = await apiService.getLatestData();
        
        if (!newData) {
            // DB is empty, do not update UI with simulated data or errors
            return;
        }

        // The frontend state is completely driven by the backend data
        if (newData.status === 'fault') {
          setPumpState('error');
        } else if (newData.speed > 0) {
          setPumpState('running');
        } else {
          setPumpState('stopped');
        }

        setCurrentData(newData);

        setHistory(h => {
          if (h.length > 0 && h[h.length - 1].timestamp === newData.timestamp) {
            return h;
          }
          const newHistory = [...h, newData];
          if (newHistory.length > MAX_HISTORY) newHistory.shift();
          return newHistory;
        });

        // Generate UI alerts based on backend data
        if (newData.status === 'fault') {
          addAlert('fault', `Critical System Health Index: ${newData.overallHealth.toFixed(2)}`, 'system');
          setLastFaultTimestamp(new Date().toISOString());
        } else if (newData.status === 'warning') {
          addAlert('warning', `System Health Warning: ${newData.overallHealth.toFixed(2)}`, 'system');
        }

        // Drastic Change (Spike) Detection
        const prevData = lastDataRef.current;
        let emergencyTriggered = false;
        if (newData.tempWinding - prevData.tempWinding > 10) { addAlert('fault', 'Emergency Stop: Drastic Winding Temp Spike', 'tempWinding'); emergencyTriggered = true; }
        if (newData.tempBearing - prevData.tempBearing > 8) { addAlert('fault', 'Emergency Stop: Drastic Bearing Temp Spike', 'tempBearing'); emergencyTriggered = true; }
        if (newData.current - prevData.current > 1.0) { addAlert('fault', 'Emergency Stop: Drastic Current Spike', 'current'); emergencyTriggered = true; }
        if (newData.speed - prevData.speed > 200) { addAlert('fault', 'Emergency Stop: Drastic Speed Spike', 'speed'); emergencyTriggered = true; }

        if (emergencyTriggered && pumpState === 'running') {
          apiService.sendCommand('emergency_stop').catch(console.error);
          setPumpState('error');
        }

        lastDataRef.current = newData;

        if (newData.tempWinding > 55) addAlert('fault', 'Critical Winding Temperature Exceeded', 'tempWinding');
        else if (newData.tempWinding > 50) addAlert('warning', 'High Winding Temperature Warning', 'tempWinding');

        if (newData.tempBearing > 55) addAlert('fault', 'Critical Bearing Temperature Exceeded', 'tempBearing');
        else if (newData.tempBearing > 50) addAlert('warning', 'High Bearing Temperature Warning', 'tempBearing');

        if (newData.tempAmbient > 45) addAlert('warning', 'High Ambient Temperature Warning', 'tempAmbient');

        if (newData.current > 5.0) addAlert('fault', 'Critical Overcurrent Detected', 'current');
        else if (newData.current > 4.2) addAlert('warning', 'High Current Warning', 'current');

        if (newData.speed > 2000) addAlert('fault', 'Critical Overspeed Detected', 'speed');
        else if (newData.speed > 1600) addAlert('warning', 'High Speed Warning', 'speed');

        if (newData.vibration > 25000) addAlert('fault', 'Critical Vibration Detected', 'vibration' as any);
        else if (newData.vibration > 22000) addAlert('warning', 'High Vibration Warning', 'vibration' as any);

        const currentMinute = new Date().getMinutes();
        if (currentMinute !== lastLoggedMinute) {
          lastLoggedMinute = currentMinute;
          addLog(`Periodic Data Log - Winding: ${newData.tempWinding.toFixed(1)}°C, Bearing: ${newData.tempBearing.toFixed(1)}°C, Ambient: ${newData.tempAmbient.toFixed(1)}°C, Current: ${newData.current.toFixed(1)}A, Speed: ${newData.speed.toFixed(0)}RPM, HI: ${(newData.overallHealth * 100).toFixed(1)}%`, 'info');
        }

      } catch (error) {
        console.error("Failed to fetch latest data from backend:", error);
      }
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring, addAlert, addLog]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    addLog(`Alert ${id} acknowledged`, 'info', 'Operator');
  };

  const clearAlerts = () => {
    setAlerts(prev => prev.filter(a => !a.acknowledged));
    addLog('Cleared acknowledged alerts', 'info', 'Operator');
  };

  const sendCommand = async (cmd: string) => {
    try {
      await apiService.sendCommand(cmd);
      
      if (cmd === 'start') {
        addLog('Pump Start Command Sent', 'info', 'Operator');
      } else if (cmd === 'stop') {
        addLog('Pump Stop Command Sent', 'info', 'Operator');
      } else if (cmd === 'emergency_stop') {
        addAlert('fault', 'Emergency Stop Initialized', 'system');
        addLog('Emergency Stop Activated', 'error', 'Operator');
      } else if (cmd === 'reset') {
        setAlerts([]);
        addLog('System Reset: Data and Alerts cleared (Logs retained)', 'info', 'Operator');
      }
    } catch (error) {
      addLog('Failed to send command to backend', 'error', 'System');
    }
  };

  const toggleMode = () => {
    setPumpMode(prev => {
      const newMode = prev === 'auto' ? 'manual' : 'auto';
      addLog(`Switched to ${newMode.toUpperCase()} mode`, 'info', 'Operator');
      return newMode;
    });
  };

  const toggleMonitoring = () => {
    setIsMonitoring(prev => {
      addLog(prev ? 'Monitoring Paused' : 'Monitoring Resumed', 'warn', 'Operator');
      return !prev;
    });
  };

  const injectData = (tempWinding: number, tempBearing: number, tempAmbient: number, current: number, speed: number) => {
    addLog(`Manual Data Injected - Winding: ${tempWinding}°C, Bearing: ${tempBearing}°C, Ambient: ${tempAmbient}°C, Current: ${current}A, Speed: ${speed}RPM`, 'warn', 'Operator');
    
    const tWNorm = Math.max(0, Math.min(1, (tempWinding - 20) / 80));
    const tBNorm = Math.max(0, Math.min(1, (tempBearing - 20) / 60));
    const cNorm = Math.max(0, Math.min(1, (current - 10) / 15));
    const sNorm = Math.max(0, Math.min(1, Math.abs(speed - 1500) / 1500)); 

    const overallHealth = (tWNorm * 0.25) + (tBNorm * 0.15) + (cNorm * 0.4) + (sNorm * 0.2);
    
    let status: SystemStatus = 'healthy';
    if (overallHealth > 0.8) status = 'fault';
    else if (overallHealth > 0.6) status = 'warning';

    if (status === 'fault') {
      addAlert('fault', `Critical System Health Index: ${overallHealth.toFixed(2)}`, 'system');
      setLastFaultTimestamp(new Date().toISOString());
    } else if (status === 'warning') {
      addAlert('warning', `System Health Warning: ${overallHealth.toFixed(2)}`, 'system');
    }

    const prevData = lastDataRef.current;
    let manualEmergencyTriggered = false;
    if (tempWinding - prevData.tempWinding > 10) { addAlert('fault', 'Emergency Stop: Drastic Winding Temp Spike', 'tempWinding'); status = 'fault'; manualEmergencyTriggered = true; }
    if (tempBearing - prevData.tempBearing > 8) { addAlert('fault', 'Emergency Stop: Drastic Bearing Temp Spike', 'tempBearing'); status = 'fault'; manualEmergencyTriggered = true; }
    if (current - prevData.current > 1.0) { addAlert('fault', 'Emergency Stop: Drastic Current Spike', 'current'); status = 'fault'; manualEmergencyTriggered = true; }
    if (speed - prevData.speed > 200) { addAlert('fault', 'Emergency Stop: Drastic Speed Spike', 'speed'); status = 'fault'; manualEmergencyTriggered = true; }

    if (manualEmergencyTriggered && pumpState === 'running') {
      apiService.sendCommand('emergency_stop').catch(console.error);
      setPumpState('error');
    }

    if (tempWinding > 80 || tempBearing > 70 || current > 5.0 || speed > 1600) {
      status = 'fault';
    }

    if (tempWinding > 80) addAlert('fault', 'Critical Winding Temperature Exceeded', 'tempWinding');
    else if (tempWinding > 70) addAlert('warning', 'High Winding Temperature Warning', 'tempWinding');

    if (tempBearing > 70) addAlert('fault', 'Critical Bearing Temperature Exceeded', 'tempBearing');
    else if (tempBearing > 60) addAlert('warning', 'High Bearing Temperature Warning', 'tempBearing');

    if (tempAmbient > 40) addAlert('warning', 'High Ambient Temperature Warning', 'tempAmbient');

    if (current > 5.0) addAlert('fault', 'Critical Overcurrent Detected', 'current');
    else if (current > 4.0) addAlert('warning', 'High Current Warning', 'current');

    if (speed > 1600) addAlert('fault', 'Critical Overspeed Detected', 'speed');
    else if (speed > 1500) addAlert('warning', 'High Speed Warning', 'speed');

    const newData: SensorData = {
      timestamp: new Date().toISOString(),
      tempWinding,
      tempBearing,
      tempAmbient,
      current,
      speed,
      vibration: 0.5,
      voltage: 400.0,
      pressure: 0.0,
      flowRate: 0.0,
      waterLevel: 85.0,
      oilQuality: 98.0,
      mechanicalHealth: 1.0,
      electricalHealth: 1.0,
      hydraulicHealth: 1.0,
      overallHealth,
      pumpEfficiency: 82.5,
      powerConsumption: 0.0,
      status
    };

    setCurrentData(newData);
    setHistory(h => {
      const newHistory = [...h, newData];
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });

    lastDataRef.current = newData;

    if (status === 'fault' && pumpState === 'running') {
      setPumpState('error');
      addLog('EMERGENCY AUTO-STOP: Critical Fault Detected from Manual Injection', 'error');
    }
  };

  return {
    currentData,
    history,
    alerts,
    logs,
    deviceStatus,
    predictions,
    pumpState,
    pumpMode,
    isMonitoring,
    pumpRuntime,
    systemUptime,
    lastFaultTimestamp,
    acknowledgeAlert,
    clearAlerts,
    sendCommand,
    toggleMode,
    toggleMonitoring,
    injectData
  };
}
