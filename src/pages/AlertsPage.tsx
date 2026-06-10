import type { Alert } from '../types';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AlertsPage({ alerts, onAcknowledge, onClear }: { alerts: Alert[], onAcknowledge: (id: string) => void, onClear: () => void }) {
  return (
    <div className="bg-ind-card border border-ind-border rounded h-full flex flex-col">
      <div className="p-4 border-b border-ind-border flex justify-between items-center shrink-0">
        <div className="text-sm md:text-base font-semibold text-ind-text-muted tracking-wide">Active System Alerts</div>
        <button 
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 text-[10px] md:text-xs font-bold tracking-wide rounded bg-ind-card-active border border-ind-border text-ind-text-muted hover:text-ind-text hover:bg-ind-card-active transition-all"
        >
          <Trash2 className="w-3 h-3 md:w-4 md:h-4" /> Clear Acknowledged
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2d3d transparent' }}>
        <AnimatePresence>
          {alerts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-ind-text-dim gap-3">
              <CheckCircle size={32} className="text-emerald-500/50" />
              <span className="font-bold text-sm md:text-base tracking-wide">No Active Alerts</span>
            </motion.div>
          )}
          {alerts.map((alert) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3 rounded border flex justify-between items-center ${
                alert.acknowledged ? 'bg-ind-card-active border-ind-border opacity-60' :
                alert.type === 'fault' ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
                'bg-amber-500/10 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  alert.acknowledged ? 'bg-ind-border text-ind-text-dim' :
                  alert.type === 'fault' ? 'bg-red-500/20 text-red-500 animate-pulse' : 
                  'bg-amber-500/20 text-amber-500'
                }`}>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div className={`text-sm md:text-base font-bold tracking-wide ${
                    alert.acknowledged ? 'text-ind-text-muted' :
                    alert.type === 'fault' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {alert.message}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] md:text-xs text-ind-text-muted">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded bg-ind-bg text-ind-text-muted capitalize border border-ind-border">
                      {alert.source}
                    </span>
                  </div>
                </div>
              </div>
              {!alert.acknowledged && (
                <button 
                  onClick={() => onAcknowledge(alert.id)}
                  className={`px-4 py-2 text-[10px] md:text-xs font-bold tracking-wide rounded border transition-all ${
                    alert.type === 'fault' ? 'bg-red-500/20 border-red-500/50 text-red-100 hover:bg-red-500/40' :
                    'bg-amber-500/20 border-amber-500/50 text-amber-100 hover:bg-amber-500/40'
                  }`}
                >
                  Acknowledge
                </button>
              )}
              {alert.acknowledged && (
                <span className="text-[10px] md:text-xs text-ind-text-muted font-semibold tracking-wide flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> Acknowledged
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
