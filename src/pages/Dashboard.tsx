import { useState } from 'react';
import type { SensorData, Alert, DeviceStatus, PumpState, PumpMode, Prediction } from '../types';
import { Power, AlertTriangle, RefreshCw, Activity, Droplets, Zap, Gauge, Settings2, ShieldCheck, Thermometer } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, Legend } from 'recharts';

interface DashboardProps {
  currentData: SensorData;
  history: SensorData[];
  deviceStatus: DeviceStatus;
  alerts: Alert[];
  pumpState: PumpState;
  pumpMode: PumpMode;
  pumpRuntime?: number;
  systemUptime?: number;
  lastFaultTimestamp?: string | null;
  onCommand: (cmd: string) => void;
  onToggleMode: () => void;
  onAcknowledgeAlert: (id: string) => void;
  onClearAlerts: () => void;
  onInjectData?: (tempWinding: number, tempBearing: number, tempAmbient: number, current: number, speed: number) => void;
  onNavigate?: (page: any) => void;
  predictions?: Prediction[];
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const StatCard = ({ title, value, unit, status, icon: Icon, onClick, clickable }: any) => (
  <div 
    onClick={onClick}
    className={`p-3 rounded border bg-ind-card flex flex-col gap-1 relative overflow-hidden ${
    status === 'healthy' ? 'border-emerald-500/20' : 
    status === 'warning' ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 
    'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
  } ${clickable ? 'cursor-pointer hover:bg-ind-card-active transition-colors group' : ''}`}>
    <div className="flex justify-between items-center text-ind-text-muted text-[10px] uppercase font-bold tracking-wider">
      <span className={`${clickable ? 'group-hover:text-ind-text transition-colors' : ''}`}>{title}</span>
      <Icon className={`w-3 h-3 ${
        status === 'healthy' ? 'text-emerald-500' : 
        status === 'warning' ? 'text-amber-500' : 'text-red-500 animate-pulse'
      }`} />
    </div>
    <div className="flex items-baseline gap-1 mt-1">
      <span className={`text-2xl font-mono ${
        status === 'healthy' ? 'text-emerald-400' : 
        status === 'warning' ? 'text-amber-400' : 'text-red-400'
      }`}>
        {value}
      </span>
      <span className="text-ind-text-muted text-xs ml-1 font-semibold">{unit}</span>
    </div>
  </div>
);

const CircularGauge = ({ value, label, color, status }: any) => (
  <div className="flex flex-col items-center justify-center">
    <div className="relative flex items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 100 100" className="rotate-[-90deg]">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e2d3d" strokeWidth="8" />
        <circle cx="50" cy="50" r="40" fill="none" 
          stroke={color} 
          strokeWidth="8" 
          strokeDasharray={`${value * 251} 251`} 
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-mono font-bold" style={{ color }}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
    </div>
    <span className="text-[10px] uppercase font-bold text-ind-text-muted mt-2">{label}</span>
  </div>
);

export function Dashboard({ currentData, history, pumpState, pumpMode, pumpRuntime = 0, systemUptime = 0, lastFaultTimestamp, predictions = [], onCommand, onToggleMode }: DashboardProps) {
  const getStatus = (val: number, warn: number, fault: number) => val >= fault ? 'fault' : val >= warn ? 'warning' : 'healthy';

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
      {/* SCADA MIMIC PANEL (Center left) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
        
        {/* Analog Sensor Array */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard title="Vibration" value={currentData.vibration.toFixed(0)} unit="raw" status={getStatus(currentData.vibration, 22000, 25000)} icon={Activity} />
          <StatCard title="Motor Temp" value={currentData.tempWinding.toFixed(1)} unit="°C" status={getStatus(currentData.tempWinding, 50, 55)} icon={Thermometer} />
          <StatCard title="Current" value={currentData.current.toFixed(2)} unit="A" status={getStatus(currentData.current, 4.2, 5.0)} icon={Zap} />
          <StatCard title="Pump Speed" value={currentData.speed.toFixed(0)} unit="RPM" status={getStatus(currentData.speed, 1600, 2000)} icon={Settings2} />
        </div>

        {/* Real-time Trend Chart */}
        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col flex-1 min-h-[300px]">
          <div className="text-sm font-semibold text-ind-text-muted mb-4 uppercase tracking-wide shrink-0">Real-Time Telemetry Trends</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis yAxisId="left" stroke="#4a6070" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#4a6070" fontSize={10} />
                <YAxis yAxisId="vib" hide domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#040810', border: '1px solid #1e2d3d', color: '#e5e7eb' }} labelStyle={{ display: 'none' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#7a8899' }} />
                <Line yAxisId="left" type="monotone" dataKey="tempWinding" stroke="#ef4444" dot={false} strokeWidth={2} name="Temp (°C)" />
                <Line yAxisId="vib" type="monotone" dataKey="vibration" stroke="#f97316" dot={false} strokeWidth={2} name="Vibration" />
                <Line yAxisId="right" type="monotone" dataKey="current" stroke="#0ea5e9" dot={false} strokeWidth={2} name="Current (A)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Analytics & Control */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
        
        {/* Health Indices (Multi-tier) */}
        <div className="bg-ind-card border border-ind-border rounded p-4">
          <div className="text-sm font-semibold text-ind-text-muted mb-4 uppercase tracking-wide flex justify-between">
            <span>System Health Analytics</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${currentData.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' : currentData.status === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400 animate-pulse'}`}>
              {currentData.status.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-center py-4">
            <CircularGauge value={currentData.overallHealth} label="Overall" color={currentData.overallHealth > 0.8 ? '#10b981' : currentData.overallHealth > 0.6 ? '#f59e0b' : '#ef4444'} />
          </div>
        </div>

        {/* Pump Controls */}
        <div className="bg-ind-card border border-ind-border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-ind-text-muted uppercase tracking-wide">SCADA Control Panel</div>
            <button onClick={onToggleMode} className={`px-2 py-1 text-[10px] uppercase font-bold rounded border transition-colors ${
              pumpMode === 'auto' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-ind-border border-ind-border text-ind-text'
            }`}>
              {pumpMode} MODE
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 bg-ind-card-hover border border-ind-border p-2 rounded">
            <span className="text-xs font-semibold text-ind-text-muted uppercase">Contactor:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
              pumpState === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              pumpState === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
              'bg-ind-border text-ind-text-muted border border-ind-border'
            }`}>
              {pumpState}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              disabled={pumpMode === 'auto' || pumpState === 'running'}
              onClick={() => onCommand('start')}
              className="flex items-center justify-center gap-2 bg-ind-card-active border border-emerald-500/50 text-emerald-400 p-3 rounded hover:bg-emerald-500/20 disabled:opacity-50 transition-all font-mono text-sm font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]"
            >
              <Power size={14} /> START
            </button>
            <button 
              disabled={pumpMode === 'auto' || pumpState === 'stopped'}
              onClick={() => onCommand('stop')}
              className="flex items-center justify-center gap-2 bg-ind-card-active border border-amber-500/50 text-amber-400 p-3 rounded hover:bg-amber-500/20 disabled:opacity-50 transition-all font-mono text-sm font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]"
            >
              <Power size={14} /> STOP
            </button>
          </div>
          
          <button 
            onClick={() => onCommand('emergency_stop')}
            className="flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/60 text-red-400 p-3 rounded w-full hover:bg-red-500/30 transition-all font-mono text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse hover:animate-none"
          >
            <ShieldCheck size={16} /> EMERGENCY STOP / LOCKOUT
          </button>
        </div>
      </div>
    </div>
  );
}
