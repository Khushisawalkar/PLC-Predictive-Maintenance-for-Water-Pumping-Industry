import { useState } from 'react';
import type { SensorData, Alert, DeviceStatus, PumpState, PumpMode, Prediction } from '../types';
import { Power, AlertTriangle, RefreshCw, Activity, Send } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
    className={`p-4 rounded border bg-[#070d13] flex flex-col gap-2 relative overflow-hidden ${
    status === 'healthy' ? 'border-emerald-500/20' : 
    status === 'warning' ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 
    'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
  } ${clickable ? 'cursor-pointer hover:bg-[#0d1520] transition-colors group' : ''}`}>
    <div className="flex justify-between items-center text-[#4a6070] text-xs font-mono font-bold">
      <span className={`${clickable ? 'group-hover:text-[#8a9aaa] transition-colors' : ''}`}>{title}</span>
      <Icon size={14} className={
        status === 'healthy' ? 'text-emerald-500' : 
        status === 'warning' ? 'text-amber-500' : 'text-red-500 animate-pulse'
      } />
    </div>
    <div className="flex items-baseline gap-1">
      <span className={`text-3xl font-mono ${
        status === 'healthy' ? 'text-emerald-400' : 
        status === 'warning' ? 'text-amber-400' : 'text-red-400'
      }`}>
        {value}
      </span>
      <span className="text-[#4a6070] text-sm font-mono">{unit}</span>
    </div>
  </div>
);

export function Dashboard({ currentData, history, pumpState, pumpMode, pumpRuntime = 0, systemUptime = 0, lastFaultTimestamp, predictions = [], onCommand, onToggleMode, onInjectData, onNavigate }: DashboardProps) {
  const getStatus = (val: number, warn: number, fault: number) => val >= fault ? 'fault' : val >= warn ? 'warning' : 'healthy';

  const [manualTempWinding, setManualTempWinding] = useState<string>('65');
  const [manualTempBearing, setManualTempBearing] = useState<string>('50');
  const [manualTempAmbient, setManualTempAmbient] = useState<string>('25');
  const [manualCurrent, setManualCurrent] = useState<string>('24');
  const [manualSpeed, setManualSpeed] = useState<string>('2900');

  const handleInject = () => {
    if (onInjectData) {
      onInjectData(Number(manualTempWinding) || 0, Number(manualTempBearing) || 0, Number(manualTempAmbient) || 0, Number(manualCurrent) || 0, Number(manualSpeed) || 0);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Top Stats */}
      <div className="col-span-12 grid grid-cols-3 gap-4">
        <StatCard 
          title="MOTOR CURRENT" value={currentData.current.toFixed(1)} unit="A" 
          status={getStatus(currentData.current, 18, 22)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
        <StatCard 
          title="PUMP SPEED" value={currentData.speed.toFixed(0)} unit="RPM" 
          status={getStatus(currentData.speed, 2500, 2800)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
        <StatCard 
          title="OVERALL PERF" value={((1 - currentData.healthIndex) * 100).toFixed(1)} unit="%" 
          status={currentData.healthIndex >= 0.8 ? 'fault' : currentData.healthIndex >= 0.6 ? 'warning' : 'healthy'} icon={Activity} 
        />
        <StatCard 
          title="WINDING TEMP" value={currentData.tempWinding.toFixed(1)} unit="°C" 
          status={getStatus(currentData.tempWinding, 70, 80)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
        <StatCard 
          title="BEARING TEMP" value={currentData.tempBearing.toFixed(1)} unit="°C" 
          status={getStatus(currentData.tempBearing, 60, 70)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
        <StatCard 
          title="AMBIENT TEMP" value={currentData.tempAmbient.toFixed(1)} unit="°C" 
          status={getStatus(currentData.tempAmbient, 40, 50)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
      </div>

      {/* Main Center Area */}
      <div className="col-span-8 flex flex-col gap-4">
        {/* Real-time Trend Chart */}
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 h-80">
          <div className="text-xs font-mono text-[#4a6070] mb-4">REAL-TIME SENSOR TRENDS</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
              <XAxis dataKey="timestamp" hide />
              <YAxis stroke="#4a6070" fontSize={10} tickFormatter={(val) => val.toFixed(0)} />
              <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} />
              <Line type="monotone" dataKey="tempWinding" stroke="#ef4444" dot={false} strokeWidth={2} name="Winding (°C)" />
              <Line type="monotone" dataKey="tempBearing" stroke="#f97316" dot={false} strokeWidth={2} name="Bearing (°C)" />
              <Line type="monotone" dataKey="tempAmbient" stroke="#84cc16" dot={false} strokeWidth={2} name="Ambient (°C)" />
              <Line type="monotone" dataKey="current" stroke="#0ea5e9" dot={false} strokeWidth={2} name="Current (A)" />
              <Line type="monotone" dataKey="speed" stroke="#a855f7" dot={false} strokeWidth={2} name="Speed (RPM)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Sidebar Controls */}
      <div className="col-span-4 flex flex-col gap-4">
        {/* Health Index Gauge */}
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col items-center justify-center relative overflow-hidden h-48">
          <div className="text-xs font-mono text-[#4a6070] absolute top-4 left-4">HEALTH INDEX</div>
          <div className="relative flex items-center justify-center mt-4">
             <svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e2d3d" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" 
                  stroke={currentData.status === 'healthy' ? '#10b981' : currentData.status === 'warning' ? '#f59e0b' : '#ef4444'} 
                  strokeWidth="8" 
                  strokeDasharray={`${currentData.healthIndex * 314} 314`} 
                  className="transition-all duration-1000"
                />
             </svg>
             <div className="absolute flex flex-col items-center">
               <span className={`text-2xl font-mono font-bold ${
                  currentData.status === 'healthy' ? 'text-emerald-400' : currentData.status === 'warning' ? 'text-amber-400' : 'text-red-400'
               }`}>
                 {(currentData.healthIndex * 100).toFixed(0)}%
               </span>
               <span className="text-[10px] text-[#4a6070] font-mono uppercase">{currentData.status}</span>
             </div>
          </div>
        </div>

        {/* System Status Panel */}
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col gap-3">
          <div className="text-xs font-mono text-[#4a6070] mb-1">SYSTEM DIAGNOSTICS</div>
          
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-[#4a6070]">SYSTEM UPTIME:</span>
            <span className="text-[#c0d0e0] bg-[#0d1520] px-2 py-0.5 rounded">{formatTime(systemUptime)}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-[#4a6070]">PUMP RUNTIME:</span>
            <span className="text-[#c0d0e0] bg-[#0d1520] px-2 py-0.5 rounded">{formatTime(pumpRuntime)}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-[#4a6070]">LAST FAULT:</span>
            <span className={lastFaultTimestamp ? "text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded" : "text-[#4a6070]"}>
              {lastFaultTimestamp ? new Date(lastFaultTimestamp).toLocaleTimeString() : 'NONE'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-[#4a6070]">AUTO-SHUTDOWN:</span>
            <span className={`px-2 py-0.5 rounded ${pumpMode === 'auto' ? "text-emerald-400 bg-emerald-500/10" : "text-[#4a6070] bg-[#0d1520]"}`}>
              {pumpMode === 'auto' ? 'ARMED' : 'DISABLED'}
            </span>
          </div>
        </div>

        {/* Component Lifespan Mini Panel */}
        {predictions.length > 0 && (
          <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col gap-3">
            <div className="text-xs font-mono text-[#4a6070]">CRITICAL LIFESPAN</div>
            {predictions.slice().sort((a, b) => a.estimatedDaysRemaining - b.estimatedDaysRemaining).slice(0, 2).map((pred, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] font-mono border-b border-[#1e2d3d] pb-2 last:border-0 last:pb-0">
                <span className="text-[#8a9aaa] truncate mr-2">{pred.component.toUpperCase()}</span>
                <span className={`px-2 py-0.5 rounded ${pred.estimatedDaysRemaining < 60 ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                  {pred.estimatedDaysRemaining} DAYS
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pump Controls */}
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-mono text-[#4a6070]">PUMP CONTROL PANEL</div>
            <button onClick={onToggleMode} className={`px-2 py-1 text-[10px] font-mono rounded border ${
              pumpMode === 'auto' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#1e2d3d] border-[#3a4a5a] text-[#c0d0e0]'
            }`}>
              {pumpMode.toUpperCase()} MODE
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 bg-[#0a1118] border border-[#1e2d3d] p-2 rounded">
            <span className="text-[10px] font-mono text-[#4a6070]">STATUS:</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              pumpState === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              pumpState === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
              'bg-[#1e2d3d] text-[#8a9aaa] border border-[#3a4a5a]'
            }`}>
              {pumpState.toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              disabled={pumpMode === 'auto' || pumpState === 'running'}
              onClick={() => onCommand('start')}
              className="flex items-center justify-center gap-2 bg-[#0d1520] border border-emerald-500/50 text-emerald-400 p-4 rounded hover:bg-emerald-500/20 disabled:opacity-50 transition-all font-mono text-sm font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Power size={18} /> START
            </button>
            <button 
              disabled={pumpMode === 'auto' || pumpState === 'stopped'}
              onClick={() => onCommand('stop')}
              className="flex items-center justify-center gap-2 bg-[#0d1520] border border-amber-500/50 text-amber-400 p-4 rounded hover:bg-amber-500/20 disabled:opacity-50 transition-all font-mono text-sm font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <Power size={18} /> STOP
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <button 
              onClick={() => onCommand('emergency_stop')}
              className="flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/60 text-red-400 p-4 rounded hover:bg-red-500/30 transition-all font-mono text-sm font-bold col-span-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse hover:animate-none"
            >
              <AlertTriangle size={18} /> EMERGENCY STOP
            </button>
             <button 
              onClick={() => onCommand('reset')}
              className="flex items-center justify-center gap-2 bg-[#0d1520] border border-[#3a4a5a] text-[#c0d0e0] p-3 rounded hover:bg-[#1e2d3d] hover:text-white transition-all font-mono text-xs font-bold col-span-2 mt-2"
            >
              <RefreshCw size={14} /> SYSTEM RESET
            </button>
          </div>
        </div>

        {/* Manual Data Injection */}
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col gap-3">
          <div className="text-xs font-mono text-[#4a6070]">MANUAL DATA INJECTION</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-mono text-[#4a6070] block mb-1">WINDING (°C)</label>
              <input type="number" value={manualTempWinding} onChange={e => setManualTempWinding(e.target.value)} className="w-full bg-[#0d1520] border border-[#1e2d3d] text-[#c0d0e0] p-1.5 rounded text-xs font-mono outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="text-[9px] font-mono text-[#4a6070] block mb-1">BEARING (°C)</label>
              <input type="number" value={manualTempBearing} onChange={e => setManualTempBearing(e.target.value)} className="w-full bg-[#0d1520] border border-[#1e2d3d] text-[#c0d0e0] p-1.5 rounded text-xs font-mono outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="text-[9px] font-mono text-[#4a6070] block mb-1">AMBIENT (°C)</label>
              <input type="number" value={manualTempAmbient} onChange={e => setManualTempAmbient(e.target.value)} className="w-full bg-[#0d1520] border border-[#1e2d3d] text-[#c0d0e0] p-1.5 rounded text-xs font-mono outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="text-[9px] font-mono text-[#4a6070] block mb-1">CURRENT (A)</label>
              <input type="number" value={manualCurrent} onChange={e => setManualCurrent(e.target.value)} className="w-full bg-[#0d1520] border border-[#1e2d3d] text-[#c0d0e0] p-1.5 rounded text-xs font-mono outline-none focus:border-cyan-500/50" />
            </div>
            <div className="col-span-2">
              <label className="text-[9px] font-mono text-[#4a6070] block mb-1">SPEED (RPM)</label>
              <input type="number" value={manualSpeed} onChange={e => setManualSpeed(e.target.value)} className="w-full bg-[#0d1520] border border-[#1e2d3d] text-[#c0d0e0] p-1.5 rounded text-xs font-mono outline-none focus:border-cyan-500/50" />
            </div>
          </div>
          <button 
            onClick={handleInject}
            className="flex items-center justify-center gap-2 bg-[#0d1520] border border-cyan-500/30 text-cyan-400 p-2 rounded hover:bg-cyan-500/10 transition-all font-mono text-[10px] w-full"
          >
            <Send size={12} /> INJECT & PROCESS
          </button>
        </div>
      </div>
    </div>
  );
}
