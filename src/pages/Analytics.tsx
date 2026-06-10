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
        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col h-48">
          <div className="text-xs md:text-sm font-semibold text-ind-text-muted tracking-wide mb-2">Winding Temp (°C)</div>
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

        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col h-48">
          <div className="text-xs md:text-sm font-semibold text-ind-text-muted tracking-wide mb-2">Bearing Temp (°C)</div>
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

        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col h-48">
          <div className="text-xs md:text-sm font-semibold text-ind-text-muted tracking-wide mb-2">Ambient Temp (°C)</div>
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

        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col h-48">
          <div className="text-xs md:text-sm font-semibold text-ind-text-muted tracking-wide mb-2">Motor Current (A)</div>
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

        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col h-48">
          <div className="text-xs md:text-sm font-semibold text-ind-text-muted tracking-wide mb-2">Pump Speed (RPM)</div>
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

        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col h-48">
          <div className="text-xs md:text-sm font-semibold text-ind-text-muted tracking-wide mb-2 flex justify-between">
            <span>Health Index</span>
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
      
      <div className="bg-ind-card border border-ind-border rounded flex flex-col flex-1 min-h-0">
        <div className="p-3 border-b border-ind-border flex items-center justify-between bg-ind-card-hover shrink-0">
          <div className="flex items-center gap-3">
            <Table className="w-3.5 h-3.5 md:w-4 md:h-4 text-ind-text-dim" />
            <span className="text-ind-text-muted text-xs md:text-sm font-semibold tracking-wide">Historical Data Logs</span>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-1 bg-ind-card-active border border-ind-border text-ind-text-muted rounded text-xs md:text-sm hover:text-ind-text hover:bg-ind-card-active transition-all font-bold tracking-wide"
          >
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" /> Export CSV
          </button>
        </div>
        <div className="flex-1 overflow-auto p-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2d3d transparent' }}>
          <table className="w-full text-left font-mono text-xs md:text-sm">
            <thead className="bg-ind-card-active text-ind-text-dim sticky top-0 border-b border-ind-border">
              <tr>
                <th className="p-3 font-normal">Timestamp</th>
                <th className="p-3 font-normal">Winding (°C)</th>
                <th className="p-3 font-normal">Bearing (°C)</th>
                <th className="p-3 font-normal">Ambient (°C)</th>
                <th className="p-3 font-normal">Current (A)</th>
                <th className="p-3 font-normal">Speed (RPM)</th>
                <th className="p-3 font-normal">Health Idx</th>
                <th className="p-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((data, i) => (
                <tr key={i} className="border-b border-ind-border/50 hover:bg-ind-card-active transition-colors text-ind-text">
                  <td className="p-3 text-ind-text-muted">{new Date(data.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3">{data.tempWinding.toFixed(2)}</td>
                  <td className="p-3">{data.tempBearing.toFixed(2)}</td>
                  <td className="p-3">{data.tempAmbient.toFixed(2)}</td>
                  <td className="p-3">{data.current.toFixed(2)}</td>
                  <td className="p-3">{data.speed.toFixed(0)}</td>
                  <td className="p-3">{(data.healthIndex * 100).toFixed(1)}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs md:text-sm capitalize font-bold ${
                      data.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' :
                      data.status === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {data.status}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-ind-text-dim italic">No historical data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
