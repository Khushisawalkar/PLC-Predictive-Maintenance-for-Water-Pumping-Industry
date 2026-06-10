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
    className={`p-3 md:p-4 rounded border bg-ind-card flex flex-col gap-1.5 md:gap-2 relative overflow-hidden ${
    status === 'healthy' ? 'border-emerald-500/20' : 
    status === 'warning' ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 
    'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
  } ${clickable ? 'cursor-pointer hover:bg-ind-card-active transition-colors group' : ''}`}>
    <div className="flex justify-between items-center text-ind-text-muted text-xs md:text-sm font-semibold tracking-wide">
      <span className={`${clickable ? 'group-hover:text-ind-text transition-colors' : ''}`}>{title}</span>
      <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
        status === 'healthy' ? 'text-emerald-500' : 
        status === 'warning' ? 'text-amber-500' : 'text-red-500 animate-pulse'
      }`} />
    </div>
    <div className="flex items-baseline gap-1">
      <span className={`text-3xl font-mono ${
        status === 'healthy' ? 'text-emerald-400' : 
        status === 'warning' ? 'text-amber-400' : 'text-red-400'
      }`}>
        {value}
      </span>
      <span className="text-ind-text-muted text-xs md:text-sm ml-1 font-semibold">{unit}</span>
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
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
      {/* Top Stats */}
      <div className="col-span-12 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <StatCard 
          title="Motor Current" value={currentData.current.toFixed(1)} unit="A" 
          status={getStatus(currentData.current, 18, 22)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
        <StatCard 
          title="Pump Speed" value={currentData.speed.toFixed(0)} unit="RPM" 
          status={getStatus(currentData.speed, 2500, 2800)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
        <StatCard 
          title="Overall Perf" value={((1 - currentData.healthIndex) * 100).toFixed(1)} unit="%" 
          status={currentData.healthIndex >= 0.8 ? 'fault' : currentData.healthIndex >= 0.6 ? 'warning' : 'healthy'} icon={Activity} 
        />
        <StatCard 
          title="Winding Temp" value={currentData.tempWinding.toFixed(1)} unit="°C" 
          status={getStatus(currentData.tempWinding, 70, 80)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
        <StatCard 
          title="Bearing Temp" value={currentData.tempBearing.toFixed(1)} unit="°C" 
          status={getStatus(currentData.tempBearing, 60, 70)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
        <StatCard 
          title="Ambient Temp" value={currentData.tempAmbient.toFixed(1)} unit="°C" 
          status={getStatus(currentData.tempAmbient, 40, 50)} icon={Activity} 
          onClick={() => onNavigate?.('analytics')} clickable 
        />
      </div>

      {/* Main Center Area */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
        {/* Real-time Trend Chart */}
        <div className="bg-ind-card border border-ind-border rounded p-4 h-80">
          <div className="text-sm md:text-base font-semibold text-ind-text-muted mb-4">Real-Time Sensor Trends</div>
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
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
        {/* Health Index Gauge */}
        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col items-center justify-center relative overflow-hidden h-48">
          <div className="text-sm md:text-base font-semibold text-ind-text-muted absolute top-4 left-4">Health Index</div>
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
               <span className={`text-2xl md:text-3xl font-mono font-bold ${
                  currentData.status === 'healthy' ? 'text-emerald-400' : currentData.status === 'warning' ? 'text-amber-400' : 'text-red-400'
               }`}>
                 {(currentData.healthIndex * 100).toFixed(0)}%
               </span>
               <span className="text-xs md:text-sm text-ind-text-muted font-semibold capitalize mt-1">{currentData.status}</span>
             </div>
          </div>
        </div>

        {/* System Status Panel */}
        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col gap-3">
          <div className="text-sm md:text-base font-semibold text-ind-text-muted mb-1">System Diagnostics</div>
          
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-ind-text-muted">System Uptime:</span>
            <span className="text-ind-text bg-ind-card-active px-2 py-0.5 rounded font-mono">{formatTime(systemUptime)}</span>
          </div>
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-ind-text-muted">Pump Runtime:</span>
            <span className="text-ind-text bg-ind-card-active px-2 py-0.5 rounded font-mono">{formatTime(pumpRuntime)}</span>
          </div>
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-ind-text-muted">Last Fault:</span>
            <span className={`font-mono ${lastFaultTimestamp ? "text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded" : "text-ind-text-dim"}`}>
              {lastFaultTimestamp ? new Date(lastFaultTimestamp).toLocaleTimeString() : 'None'}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-ind-text-muted">Auto-Shutdown:</span>
            <span className={`px-2 py-0.5 rounded font-semibold ${pumpMode === 'auto' ? "text-emerald-400 bg-emerald-500/10" : "text-ind-text-muted bg-ind-card-active"}`}>
              {pumpMode === 'auto' ? 'Armed' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Component Lifespan Mini Panel */}
        {predictions.length > 0 && (
          <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col gap-3">
            <div className="text-sm md:text-base font-semibold text-ind-text-muted">Critical Lifespan</div>
            {predictions.slice().sort((a, b) => a.estimatedDaysRemaining - b.estimatedDaysRemaining).slice(0, 2).map((pred, i) => (
              <div key={i} className="flex justify-between items-center text-xs md:text-sm border-b border-ind-border pb-2 last:border-0 last:pb-0">
                <span className="text-ind-text truncate mr-2 font-medium capitalize">{pred.component}</span>
                <span className={`px-2 py-0.5 rounded font-bold ${pred.estimatedDaysRemaining < 60 ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                  {pred.estimatedDaysRemaining} Days
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pump Controls */}
        <div className="bg-ind-card border border-ind-border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm md:text-base font-semibold text-ind-text-muted">Pump Control Panel</div>
            <button onClick={onToggleMode} className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded border transition-colors capitalize ${
              pumpMode === 'auto' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-ind-border border-ind-border text-ind-text'
            }`}>
              {pumpMode} Mode
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 bg-ind-card-hover border border-ind-border p-3 rounded">
            <span className="text-xs md:text-sm font-semibold text-ind-text-muted">Status:</span>
            <span className={`text-xs md:text-sm font-bold px-3 py-1 rounded tracking-wide capitalize ${
              pumpState === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              pumpState === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
              'bg-ind-border text-ind-text-muted border border-ind-border'
            }`}>
              {pumpState}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <button 
              disabled={pumpMode === 'auto' || pumpState === 'running'}
              onClick={() => onCommand('start')}
              className="flex items-center justify-center gap-2 bg-ind-card-active border border-emerald-500/50 text-emerald-400 p-4 rounded hover:bg-emerald-500/20 disabled:opacity-50 transition-all font-mono text-sm md:text-base font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Power size={18} /> Start
            </button>
            <button 
              disabled={pumpMode === 'auto' || pumpState === 'stopped'}
              onClick={() => onCommand('stop')}
              className="flex items-center justify-center gap-2 bg-ind-card-active border border-amber-500/50 text-amber-400 p-4 rounded hover:bg-amber-500/20 disabled:opacity-50 transition-all font-mono text-sm md:text-base font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <Power size={18} /> Stop
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
             <button 
              onClick={() => onCommand('emergency_stop')}
              className="flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/60 text-red-400 p-4 rounded hover:bg-red-500/30 transition-all font-mono text-sm md:text-base font-bold col-span-1 md:col-span-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse hover:animate-none"
            >
              <AlertTriangle size={18} /> Emergency Stop
            </button>
             <button 
              onClick={() => onCommand('reset')}
              className="flex items-center justify-center gap-2 bg-ind-card-active border border-ind-border text-ind-text p-3 rounded hover:bg-ind-border hover:text-white transition-all font-mono text-xs md:text-sm font-bold col-span-1 md:col-span-2 mt-2"
            >
              <RefreshCw size={14} /> System Reset
            </button>
          </div>
        </div>

        {/* Manual Data Injection */}
        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col gap-4">
          <div className="text-sm md:text-base font-semibold text-ind-text-muted">Manual Data Injection</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs md:text-sm text-ind-text-muted block mb-1">Winding (°C)</label>
              <input type="number" value={manualTempWinding} onChange={e => setManualTempWinding(e.target.value)} className="w-full bg-ind-card-active border border-ind-border text-ind-text p-2 rounded text-xs md:text-sm font-mono outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="text-xs md:text-sm text-ind-text-muted block mb-1">Bearing (°C)</label>
              <input type="number" value={manualTempBearing} onChange={e => setManualTempBearing(e.target.value)} className="w-full bg-ind-card-active border border-ind-border text-ind-text p-2 rounded text-xs md:text-sm font-mono outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="text-xs md:text-sm text-ind-text-muted block mb-1">Ambient (°C)</label>
              <input type="number" value={manualTempAmbient} onChange={e => setManualTempAmbient(e.target.value)} className="w-full bg-ind-card-active border border-ind-border text-ind-text p-2 rounded text-xs md:text-sm font-mono outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="text-xs md:text-sm text-ind-text-muted block mb-1">Current (A)</label>
              <input type="number" value={manualCurrent} onChange={e => setManualCurrent(e.target.value)} className="w-full bg-ind-card-active border border-ind-border text-ind-text p-2 rounded text-xs md:text-sm font-mono outline-none focus:border-cyan-500/50" />
            </div>
            <div className="col-span-2">
              <label className="text-xs md:text-sm text-ind-text-muted block mb-1">Speed (RPM)</label>
              <input type="number" value={manualSpeed} onChange={e => setManualSpeed(e.target.value)} className="w-full bg-ind-card-active border border-ind-border text-ind-text p-2 rounded text-xs md:text-sm font-mono outline-none focus:border-cyan-500/50" />
            </div>
          </div>
          <button 
            onClick={handleInject}
            className="flex items-center justify-center gap-2 bg-ind-card-active border border-cyan-500/30 text-cyan-400 p-3 rounded hover:bg-cyan-500/10 transition-all text-xs md:text-sm font-bold tracking-wider w-full mt-2"
          >
            <Send className="w-3.5 h-3.5 md:w-4 md:h-4" /> Inject & Process
          </button>
        </div>
      </div>
    </div>
  );
}
