import type { SensorData } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Download, Table } from 'lucide-react';

export function Analytics({ history, currentData }: { history: SensorData[], currentData: SensorData }) {
  const exportToCSV = () => {
    const headers = ['Timestamp', 'Winding Temp', 'Bearing Temp', 'Ambient Temp', 'Current', 'Speed', 'Health Index', 'Status'];
    const csvContent = [
      headers.join(','),
      ...history.map(data => `"${data.timestamp}",${data.tempWinding.toFixed(2)},${data.tempBearing.toFixed(2)},${data.tempAmbient.toFixed(2)},${data.current.toFixed(2)},${data.speed.toFixed(0)},${data.healthIndex.toFixed(3)},"${data.status}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sensor_history_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col gap-4 min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col h-48">
          <div className="text-sm font-semibold text-[#8a9aaa] tracking-wide mb-2">WINDING TEMP (°C)</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#ef4444" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} />
                <Line type="monotone" dataKey="tempWinding" stroke="#ef4444" dot={false} strokeWidth={2} name="Winding" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col h-48">
          <div className="text-sm font-semibold text-[#8a9aaa] tracking-wide mb-2">BEARING TEMP (°C)</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#f97316" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} />
                <Line type="monotone" dataKey="tempBearing" stroke="#f97316" dot={false} strokeWidth={2} name="Bearing" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col h-48">
          <div className="text-sm font-semibold text-[#8a9aaa] tracking-wide mb-2">AMBIENT TEMP (°C)</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#84cc16" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} />
                <Line type="monotone" dataKey="tempAmbient" stroke="#84cc16" dot={false} strokeWidth={2} name="Ambient" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col h-48">
          <div className="text-sm font-semibold text-[#8a9aaa] tracking-wide mb-2">MOTOR CURRENT (A)</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#f59e0b" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} />
                <Line type="monotone" dataKey="current" stroke="#f59e0b" dot={false} strokeWidth={2} name="Current" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col h-48">
          <div className="text-sm font-semibold text-[#8a9aaa] tracking-wide mb-2">PUMP SPEED (RPM)</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#0ea5e9" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} />
                <Line type="monotone" dataKey="speed" stroke="#0ea5e9" dot={false} strokeWidth={2} name="Speed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col h-48">
          <div className="text-sm font-semibold text-[#8a9aaa] tracking-wide mb-2 flex justify-between">
            <span>HEALTH INDEX</span>
            <span className={`font-bold ${currentData.status === 'healthy' ? 'text-emerald-400' : currentData.status === 'warning' ? 'text-amber-400' : 'text-red-400'}`}>
              {(currentData.healthIndex * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#10b981" fontSize={10} domain={[0, 1]} />
                <Tooltip contentStyle={{ backgroundColor: '#070d13', border: '1px solid #1e2d3d' }} labelStyle={{ display: 'none' }} formatter={(val: any) => (val * 100).toFixed(1) + '%'} />
                <Line type="monotone" dataKey="healthIndex" stroke="#10b981" dot={false} strokeWidth={2} name="Health" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-[#070d13] border border-[#1e2d3d] rounded flex flex-col flex-1 min-h-0">
        <div className="p-3 border-b border-[#1e2d3d] flex items-center justify-between bg-[#0a1118] shrink-0">
          <div className="flex items-center gap-3">
            <Table size={16} className="text-[#4a6070]" />
            <span className="text-[#8a9aaa] text-sm font-semibold tracking-wide">HISTORICAL DATA LOGS</span>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-1 bg-[#0d1520] border border-[#1e2d3d] text-[#8a9aaa] rounded text-xs hover:text-[#c0d0e0] hover:bg-[#1a2636] transition-all font-bold tracking-wide"
          >
            <Download size={14} /> EXPORT CSV
          </button>
        </div>
        <div className="flex-1 overflow-auto p-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2d3d transparent' }}>
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0d1520] text-[#4a6070] sticky top-0 border-b border-[#1e2d3d]">
              <tr>
                <th className="p-3 font-normal">TIMESTAMP</th>
                <th className="p-3 font-normal">WINDING (°C)</th>
                <th className="p-3 font-normal">BEARING (°C)</th>
                <th className="p-3 font-normal">AMBIENT (°C)</th>
                <th className="p-3 font-normal">CURRENT (A)</th>
                <th className="p-3 font-normal">SPEED (RPM)</th>
                <th className="p-3 font-normal">HEALTH IDX</th>
                <th className="p-3 font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((data, i) => (
                <tr key={i} className="border-b border-[#1e2d3d]/50 hover:bg-[#0d1520] transition-colors text-[#c0d0e0]">
                  <td className="p-3 text-[#8a9aaa]">{new Date(data.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3">{data.tempWinding.toFixed(2)}</td>
                  <td className="p-3">{data.tempBearing.toFixed(2)}</td>
                  <td className="p-3">{data.tempAmbient.toFixed(2)}</td>
                  <td className="p-3">{data.current.toFixed(2)}</td>
                  <td className="p-3">{data.speed.toFixed(0)}</td>
                  <td className="p-3">{(data.healthIndex * 100).toFixed(1)}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      data.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' :
                      data.status === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {data.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-[#4a6070] italic">No historical data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
