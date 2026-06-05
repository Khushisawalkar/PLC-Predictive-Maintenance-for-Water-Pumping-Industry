import type { Prediction, SensorData } from '../types';
import { Wrench, ShieldAlert, Cpu } from 'lucide-react';

export function MaintenancePage({ predictions, currentData }: { predictions: Prediction[], currentData: SensorData }) {
  const overallHealth = currentData.healthIndex;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col gap-2">
          <div className="text-sm md:text-base font-semibold text-[#8a9aaa] flex justify-between items-center tracking-wide">
            SYSTEM HEALTH PROBABILITY
            <ShieldAlert size={16} className={overallHealth < 0.6 ? 'text-emerald-500' : overallHealth < 0.8 ? 'text-amber-500' : 'text-red-500'} />
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl md:text-4xl font-mono ${overallHealth < 0.6 ? 'text-emerald-400' : overallHealth < 0.8 ? 'text-amber-400' : 'text-red-400'}`}>
              {((1 - overallHealth) * 100).toFixed(1)}%
            </span>
            <span className="text-[#8a9aaa] text-xs md:text-sm lg:text-base mb-1 font-semibold">REMAINING</span>
          </div>
        </div>

        <div className="bg-[#070d13] border border-[#1e2d3d] rounded p-4 flex flex-col gap-2 md:col-span-2">
          <div className="text-sm md:text-base font-semibold text-[#8a9aaa] flex items-center gap-2 tracking-wide">
            <Cpu className="w-4 h-4 md:w-5 md:h-5" /> AI DIAGNOSTIC SUMMARY
          </div>
          <p className="text-[#c0d0e0] text-xs md:text-sm leading-relaxed mt-1">
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
          <div className="text-sm md:text-base font-semibold text-[#8a9aaa] flex items-center gap-2 tracking-wide">
            <Wrench className="w-4 h-4 md:w-5 md:h-5" /> COMPONENT FAILURE PREDICTIONS
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          {predictions.map((pred, i) => (
            <div key={i} className="border border-[#1e2d3d] bg-[#0a1118] rounded p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <div className="flex-1 w-full">
                <div className="text-sm md:text-base font-bold text-[#c0d0e0] mb-1 tracking-wide">{pred.component.toUpperCase()}</div>
                <div className="text-[10px] md:text-xs text-[#8a9aaa]">{pred.recommendation}</div>
              </div>
              
              <div className="flex flex-col items-start md:items-end w-full md:w-48">
                <div className="text-[10px] md:text-xs font-semibold text-[#8a9aaa] mb-1 tracking-wide">FAILURE PROBABILITY</div>
                <div className="w-full bg-[#1e2d3d] rounded-full h-2 mb-1">
                  <div 
                    className={`h-full rounded-full ${pred.probabilityOfFailure > 0.1 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${pred.probabilityOfFailure * 100}%` }}
                  />
                </div>
                <div className="text-[10px] md:text-xs font-mono text-[#c0d0e0]">{(pred.probabilityOfFailure * 100).toFixed(1)}%</div>
              </div>

              <div className="flex flex-col items-start md:items-end w-full md:w-32 border-t md:border-t-0 md:border-l border-[#1e2d3d] pt-3 md:pt-0 md:pl-6">
                <div className="text-[10px] md:text-xs font-semibold text-[#8a9aaa] mb-1 tracking-wide">EST. LIFESPAN</div>
                <div className={`text-lg md:text-xl font-mono font-bold ${pred.estimatedDaysRemaining < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {pred.estimatedDaysRemaining}
                  <span className="text-[10px] md:text-xs text-[#4a6070] ml-1">d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
