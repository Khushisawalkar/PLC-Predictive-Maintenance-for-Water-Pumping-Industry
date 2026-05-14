import type { SensorData } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function Analytics({ history, currentData }: { history: SensorData[], currentData: SensorData }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid grid-cols-2 gap-4 h-1/2">
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col">
          <div className="text-xs font-mono text-[#4a6070] mb-4">TEMPERATURE & VIBRATION CORRELATION</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis yAxisId="left" stroke="#ef4444" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" dot={false} strokeWidth={2} name="Temp (°C)" />
                <Line yAxisId="right" type="monotone" dataKey="vibration" stroke="#f59e0b" dot={false} strokeWidth={2} name="Vib (mm/s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col">
          <div className="text-xs font-mono text-[#4a6070] mb-4">SPEED (RPM)</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#0ea5e9" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} />
                <Line type="stepAfter" dataKey="speed" stroke="#0ea5e9" dot={false} strokeWidth={2} name="Speed (RPM)" fill="#0ea5e9" fillOpacity={0.2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 h-1/2 flex flex-col">
        <div className="text-xs font-mono text-[#4a6070] mb-4 flex justify-between">
          <span>HEALTH INDEX TREND</span>
          <span className={`font-bold ${currentData.status === 'healthy' ? 'text-emerald-400' : currentData.status === 'warning' ? 'text-amber-400' : 'text-red-400'}`}>
            CURRENT: {(currentData.healthIndex * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
              <XAxis dataKey="timestamp" hide />
              <YAxis stroke="#10b981" fontSize={10} domain={[0, 1]} />
              <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} formatter={(val: any) => (val * 100).toFixed(1) + '%'} />
              <Line type="monotone" dataKey="healthIndex" stroke="#10b981" dot={false} strokeWidth={2} name="Health Index" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
