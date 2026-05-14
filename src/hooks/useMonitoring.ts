import { useState, useEffect, useCallback } from 'react';
import type { SensorData, Alert, SystemLog, DeviceStatus, Prediction, PumpState, PumpMode, SystemStatus } from '../types';

const MAX_HISTORY = 100;

export function useMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [pumpState, setPumpState] = useState<PumpState>('stopped');
  const [pumpMode, setPumpMode] = useState<PumpMode>('auto');

  const [currentData, setCurrentData] = useState<SensorData>({
    timestamp: new Date().toISOString(),
    temperature: 45.5,
    vibration: 2.1,
    speed: 1450,
    healthIndex: 0.2,
    status: 'healthy'
  });

  const [history, setHistory] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', timestamp: new Date().toISOString(), event: 'System Initialized', level: 'info', user: 'System' }
  ]);

  const [deviceStatus] = useState<DeviceStatus>({
    plcBrand: 'Mitsubishi FX5U',
    protocol: 'Modbus TCP',
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
    }, ...prev].slice(0, 100));
  }, []);

  const addAlert = useCallback((type: 'warning' | 'fault', message: string, source: Alert['source']) => {
    setAlerts(prev => {
      // Don't spam same alert
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
      setCurrentData(prev => {
        // Simulate data fluctuations
        const temperature = Math.max(20, Math.min(100, prev.temperature + (Math.random() - 0.5) * 2));
        const vibration = Math.max(0, Math.min(20, prev.vibration + (Math.random() - 0.5) * 0.5));
        const speed = pumpState === 'running' ? Math.max(0, Math.min(3000, prev.speed + (Math.random() - 0.5) * 50)) : 0;

        // Calculate Health Index (HI)
        // Normalized weights (simplified)
        const tNorm = (temperature - 20) / 80;
        const vNorm = vibration / 20;
        const sNorm = pumpState === 'running' ? Math.abs(speed - 1500) / 1500 : 0; // Deviation from optimal 1500 RPM

        const healthIndex = (tNorm * 0.4) + (vNorm * 0.4) + (sNorm * 0.2);
        
        let status: SystemStatus = 'healthy';
        if (healthIndex > 0.8) status = 'fault';
        else if (healthIndex > 0.6) status = 'warning';

        // Check for alerts
        if (status === 'fault') {
          addAlert('fault', `Critical System Health Index: ${healthIndex.toFixed(2)}`, 'system');
        } else if (status === 'warning') {
          addAlert('warning', `System Health Warning: ${healthIndex.toFixed(2)}`, 'system');
        }

        if (temperature > 80) addAlert('fault', 'Critical Temperature Exceeded', 'temperature');
        else if (temperature > 70) addAlert('warning', 'High Temperature Warning', 'temperature');

        if (vibration > 15) addAlert('fault', 'Critical Vibration Detected', 'vibration');
        else if (vibration > 10) addAlert('warning', 'High Vibration Warning', 'vibration');

        if (speed > 2800) addAlert('fault', 'Critical Overspeed Detected', 'speed');
        else if (speed > 2500) addAlert('warning', 'High Speed Warning', 'speed');

        const newData: SensorData = {
          timestamp: new Date().toISOString(),
          temperature,
          vibration,
          speed,
          healthIndex,
          status
        };

        setHistory(h => {
          const newHistory = [...h, newData];
          if (newHistory.length > MAX_HISTORY) newHistory.shift();
          return newHistory;
        });

        // Auto shutdown on fault if in auto mode
        if (pumpMode === 'auto' && status === 'fault' && pumpState === 'running') {
          setPumpState('error');
          addLog('Auto emergency shutdown due to critical fault', 'error');
        }

        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, pumpState, pumpMode, addAlert, addLog]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    addLog(`Alert ${id} acknowledged`, 'info', 'Operator');
  };

  const clearAlerts = () => {
    setAlerts(prev => prev.filter(a => !a.acknowledged));
    addLog('Cleared acknowledged alerts', 'info', 'Operator');
  };

  const sendCommand = (cmd: string) => {
    if (cmd === 'start') {
      setPumpState('running');
      addLog('Pump Start Command Sent', 'info', 'Operator');
    } else if (cmd === 'stop') {
      setPumpState('stopped');
      addLog('Pump Stop Command Sent', 'info', 'Operator');
    } else if (cmd === 'emergency_stop') {
      setPumpState('error');
      addLog('EMERGENCY STOP ACTIVATED', 'error', 'Operator');
    } else if (cmd === 'reset') {
      setPumpState('stopped');
      addLog('System Reset', 'info', 'Operator');
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
    acknowledgeAlert,
    clearAlerts,
    sendCommand,
    toggleMode,
    toggleMonitoring
  };
}
