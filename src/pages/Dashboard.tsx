import type { SensorData, Alert, DeviceStatus, PumpState, PumpMode } from '../types';
import { Power, AlertTriangle, RefreshCw, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardProps {
  currentData: SensorData;
  history: SensorData[];
  deviceStatus: DeviceStatus;
  alerts: Alert[];
  pumpState: PumpState;
  pumpMode: PumpMode;
  onCommand: (cmd: string) => void;
  onToggleMode: () => void;
  onAcknowledgeAlert: (id: string) => void;
  onClearAlerts: () => void;
}

const StatCard = ({ title, value, unit, status, icon: Icon }: any) => (
  <div className={`p-4 rounded border bg-[#070d13] flex flex-col gap-2 relative overflow-hidden ${
    status === 'healthy' ? 'border-emerald-500/20' : 
    status === 'warning' ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 
    'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
  }`}>
    <div className="flex justify-between items-center text-[#4a6070] text-xs font-mono font-bold">
      {title}
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

export function Dashboard({ currentData, history, pumpState, pumpMode, onCommand, onToggleMode }: DashboardProps) {
  const getStatus = (val: number, warn: number, fault: number) => val >= fault ? 'fault' : val >= warn ? 'warning' : 'healthy';

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Top Stats */}
      <div className="col-span-12 grid grid-cols-3 gap-4">
        <StatCard title="TEMPERATURE" value={currentData.temperature.toFixed(1)} unit="°C" status={getStatus(currentData.temperature, 70, 80)} icon={Activity} />
        <StatCard title="VIBRATION" value={currentData.vibration.toFixed(2)} unit="mm/s" status={getStatus(currentData.vibration, 10, 15)} icon={Activity} />
        <StatCard title="SPEED" value={currentData.speed.toFixed(0)} unit="RPM" status={getStatus(currentData.speed, 2500, 2800)} icon={Activity} />
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
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" dot={false} strokeWidth={2} name="Temp (°C)" />
              <Line type="monotone" dataKey="vibration" stroke="#f59e0b" dot={false} strokeWidth={2} name="Vib (mm/s)" />
              <Line type="monotone" dataKey="speed" stroke="#0ea5e9" dot={false} strokeWidth={2} name="Speed (RPM)" />
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
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              disabled={pumpMode === 'auto' || pumpState === 'running'}
              onClick={() => onCommand('start')}
              className="flex items-center justify-center gap-2 bg-[#0d1520] border border-emerald-500/30 text-emerald-400 p-3 rounded hover:bg-emerald-500/10 disabled:opacity-50 transition-all font-mono text-xs"
            >
              <Power size={14} /> START
            </button>
            <button 
              disabled={pumpMode === 'auto' || pumpState === 'stopped'}
              onClick={() => onCommand('stop')}
              className="flex items-center justify-center gap-2 bg-[#0d1520] border border-amber-500/30 text-amber-400 p-3 rounded hover:bg-amber-500/10 disabled:opacity-50 transition-all font-mono text-xs"
            >
              <Power size={14} /> STOP
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <button 
              onClick={() => onCommand('emergency_stop')}
              className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded hover:bg-red-500/20 transition-all font-mono text-xs font-bold col-span-2"
            >
              <AlertTriangle size={14} /> EMERGENCY STOP
            </button>
             <button 
              onClick={() => onCommand('reset')}
              className="flex items-center justify-center gap-2 bg-[#0d1520] border border-[#3a4a5a] text-[#8a9aaa] p-2 rounded hover:bg-[#1e2d3d] transition-all font-mono text-[10px] col-span-2 mt-2"
            >
              <RefreshCw size={12} /> SYSTEM RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
