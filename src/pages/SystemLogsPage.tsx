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
    <div className="bg-ind-card border border-ind-border rounded h-full flex flex-col overflow-hidden font-mono text-sm">
      <div className="p-3 border-b border-ind-border flex items-center justify-between bg-ind-card-hover">
        <div className="flex items-center gap-3">
          <Terminal size={16} className="text-ind-text-dim" />
          <span className="text-ind-text-muted text-xs md:text-sm font-semibold tracking-wide">System_Event_Logger.exe</span>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-3 py-1 bg-ind-card-active border border-ind-border text-ind-text-muted rounded text-[10px] md:text-xs hover:text-ind-text hover:bg-ind-card-active transition-all font-bold tracking-wide"
        >
          <Download className="w-3 h-3 md:w-4 md:h-4" /> Export CSV
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2d3d transparent' }}>
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 hover:bg-ind-card-active px-2 py-1 rounded transition-colors group">
            <span className="text-ind-text-dim shrink-0 text-[10px] md:text-xs mt-0.5">
              [{new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}]
            </span>
            <span className={`shrink-0 w-12 md:w-16 text-[10px] md:text-xs mt-0.5 capitalize ${
              log.level === 'info' ? 'text-[#0ea5e9]' : 
              log.level === 'warn' ? 'text-[#f59e0b]' : 'text-[#ef4444]'
            }`}>
              {log.level}
            </span>
            <span className={`flex-1 text-xs md:text-sm ${
              log.level === 'info' ? 'text-ind-text' : 
              log.level === 'warn' ? 'text-[#fcd34d]' : 'text-[#fca5a5]'
            }`}>
              {log.event}
            </span>
            <span className="text-ind-text-dim text-[10px] md:text-xs shrink-0 capitalize opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              User: {log.user || 'System'}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-ind-text-dim italic">No logs available.</div>
        )}
      </div>
    </div>
  );
}
