import type { Prediction, SensorData } from '../types';
import { Wrench, ShieldAlert, Cpu } from 'lucide-react';

export function MaintenancePage({ predictions, currentData }: { predictions: Prediction[], currentData: SensorData }) {
  const overallHealth = currentData.healthIndex;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col gap-2">
          <div className="text-xs font-mono text-[#4a6070] flex justify-between items-center">
            SYSTEM HEALTH PROBABILITY
            <ShieldAlert size={14} className={overallHealth < 0.6 ? 'text-emerald-500' : overallHealth < 0.8 ? 'text-amber-500' : 'text-red-500'} />
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-mono ${overallHealth < 0.6 ? 'text-emerald-400' : overallHealth < 0.8 ? 'text-amber-400' : 'text-red-400'}`}>
              {((1 - overallHealth) * 100).toFixed(1)}%
            </span>
            <span className="text-[#4a6070] text-sm mb-1 font-mono">REMAINING</span>
          </div>
        </div>

        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col gap-2 col-span-2">
          <div className="text-xs font-mono text-[#4a6070] flex items-center gap-2">
            <Cpu size={14} /> AI DIAGNOSTIC SUMMARY
          </div>
          <p className="text-[#8a9aaa] text-sm leading-relaxed font-mono mt-1">
            {overallHealth < 0.6 
              ? "System is operating within optimal parameters. No immediate maintenance required. Machine learning models indicate a stable lifecycle for all major components."
              : overallHealth < 0.8
              ? "Warning: Degradation detected in primary components. Vibration and temperature patterns suggest early-stage wear. Recommend scheduling preventative maintenance within 14 days."
              : "CRITICAL: Imminent failure probability high. Health index threshold exceeded. Immediate shutdown and inspection of pump assembly and bearings required."}
          </p>
        </div>
      </div>

      <div className="bg-[#070d13] border border-[#1e2d3d] rounded flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#1e2d3d]">
          <div className="text-sm font-mono text-[#4a6070] flex items-center gap-2">
            <Wrench size={16} /> COMPONENT FAILURE PREDICTIONS
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          {predictions.map((pred, i) => (
            <div key={i} className="border border-[#1e2d3d] bg-[#0a1118] rounded p-4 flex items-center gap-6">
              <div className="flex-1">
                <div className="text-sm font-mono font-bold text-[#c0d0e0] mb-1">{pred.component.toUpperCase()}</div>
                <div className="text-xs font-mono text-[#8a9aaa]">{pred.recommendation}</div>
              </div>
              
              <div className="flex flex-col items-end w-48">
                <div className="text-[10px] font-mono text-[#4a6070] mb-1">FAILURE PROBABILITY</div>
                <div className="w-full bg-[#1e2d3d] rounded-full h-2 mb-1">
                  <div 
                    className={`h-full rounded-full ${pred.probabilityOfFailure > 0.1 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${pred.probabilityOfFailure * 100}%` }}
                  />
                </div>
                <div className="text-xs font-mono text-[#c0d0e0]">{(pred.probabilityOfFailure * 100).toFixed(1)}%</div>
              </div>

              <div className="flex flex-col items-end w-32 border-l border-[#1e2d3d] pl-6">
                <div className="text-[10px] font-mono text-[#4a6070] mb-1">EST. LIFESPAN</div>
                <div className={`text-xl font-mono ${pred.estimatedDaysRemaining < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {pred.estimatedDaysRemaining}
                  <span className="text-xs text-[#4a6070] ml-1">d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
