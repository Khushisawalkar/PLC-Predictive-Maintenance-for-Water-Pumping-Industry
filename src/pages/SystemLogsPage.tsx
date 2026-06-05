import type { SystemLog } from '../types';
import { Terminal, Download } from 'lucide-react';

export function SystemLogsPage({ logs }: { logs: SystemLog[] }) {
  const exportToCSV = () => {
    const headers = ['Timestamp', 'Level', 'Event', 'User'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => `"${log.timestamp}","${log.level}","${log.event.replace(/"/g, '""')}","${log.user || 'SYSTEM'}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `system_logs_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="bg-[#070d13] border border-[#1e2d3d] rounded h-full flex flex-col overflow-hidden font-mono text-sm">
      <div className="p-3 border-b border-[#1e2d3d] flex items-center justify-between bg-[#0a1118]">
        <div className="flex items-center gap-3">
          <Terminal size={16} className="text-[#4a6070]" />
          <span className="text-[#8a9aaa] text-sm font-semibold tracking-wide">SYSTEM_EVENT_LOGGER.EXE</span>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-3 py-1 bg-[#0d1520] border border-[#1e2d3d] text-[#8a9aaa] rounded text-xs hover:text-[#c0d0e0] hover:bg-[#1a2636] transition-all font-bold tracking-wide"
        >
          <Download size={14} /> EXPORT CSV
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2d3d transparent' }}>
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 hover:bg-[#0d1520] px-2 py-1 rounded transition-colors group">
            <span className="text-[#4a6070] shrink-0 text-xs mt-0.5">
              [{new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}]
            </span>
            <span className={`shrink-0 w-16 text-xs mt-0.5 ${
              log.level === 'info' ? 'text-[#0ea5e9]' : 
              log.level === 'warn' ? 'text-[#f59e0b]' : 'text-[#ef4444]'
            }`}>
              {log.level.toUpperCase()}
            </span>
            <span className={`flex-1 ${
              log.level === 'info' ? 'text-[#c0d0e0]' : 
              log.level === 'warn' ? 'text-[#fcd34d]' : 'text-[#fca5a5]'
            }`}>
              {log.event}
            </span>
            <span className="text-[#3a4a5a] text-xs shrink-0 uppercase opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              USR: {log.user || 'SYSTEM'}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-[#4a6070] italic">No logs available.</div>
        )}
      </div>
    </div>
  );
}
