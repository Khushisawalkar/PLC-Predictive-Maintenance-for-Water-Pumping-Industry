import type { Prediction, SensorData } from '../types';
import { Wrench, ShieldAlert, Cpu } from 'lucide-react';

export function MaintenancePage({ predictions, currentData }: { predictions: Prediction[], currentData: SensorData }) {
  const overallHealth = currentData.healthIndex;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col gap-2">
          <div className="text-sm md:text-base font-semibold text-ind-text-muted flex justify-between items-center tracking-wide">
            System Health Probability
            <ShieldAlert size={16} className={overallHealth < 0.6 ? 'text-emerald-500' : overallHealth < 0.8 ? 'text-amber-500' : 'text-red-500'} />
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl md:text-4xl font-mono ${overallHealth < 0.6 ? 'text-emerald-400' : overallHealth < 0.8 ? 'text-amber-400' : 'text-red-400'}`}>
              {((1 - overallHealth) * 100).toFixed(1)}%
            </span>
            <span className="text-ind-text-muted text-xs md:text-sm lg:text-base mb-1 font-semibold">Remaining</span>
          </div>
        </div>

        <div className="bg-ind-card border border-ind-border rounded p-4 flex flex-col gap-2 md:col-span-2">
          <div className="text-sm md:text-base font-semibold text-ind-text-muted flex items-center gap-2 tracking-wide">
            <Cpu className="w-4 h-4 md:w-5 md:h-5" /> AI Diagnostic Summary
          </div>
          <p className="text-ind-text text-xs md:text-sm leading-relaxed mt-1">
            {overallHealth < 0.6 
              ? "System is operating within optimal parameters. No immediate maintenance required. Machine learning models indicate a stable lifecycle for all major components."
              : overallHealth < 0.8
              ? "Warning: Degradation detected in primary components. Vibration and temperature patterns suggest early-stage wear. Recommend scheduling preventative maintenance within 14 days."
              : "CRITICAL: Imminent failure probability high. Health index threshold exceeded. Immediate shutdown and inspection of pump assembly and bearings required."}
          </p>
        </div>
      </div>

      <div className="bg-ind-card border border-ind-border rounded flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-ind-border">
          <div className="text-sm md:text-base font-semibold text-ind-text-muted flex items-center gap-2 tracking-wide">
            <Wrench className="w-4 h-4 md:w-5 md:h-5" /> Component Failure Predictions
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          {predictions.map((pred, i) => (
            <div key={i} className="border border-ind-border bg-ind-card-hover rounded p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <div className="flex-1 w-full">
                <div className="text-sm md:text-base font-bold text-ind-text mb-1 tracking-wide capitalize">{pred.component}</div>
                <div className="text-xs md:text-sm text-ind-text-muted">{pred.recommendation}</div>
              </div>
              
              <div className="flex flex-col items-start md:items-end w-full md:w-48">
                <div className="text-xs md:text-sm font-semibold text-ind-text-muted mb-1 tracking-wide">Failure Probability</div>
                <div className="w-full bg-ind-border rounded-full h-2 mb-1">
                  <div 
                    className={`h-full rounded-full ${pred.probabilityOfFailure > 0.1 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${pred.probabilityOfFailure * 100}%` }}
                  />
                </div>
                <div className="text-xs md:text-sm font-mono text-ind-text">{(pred.probabilityOfFailure * 100).toFixed(1)}%</div>
              </div>

              <div className="flex flex-col items-start md:items-end w-full md:w-32 border-t md:border-t-0 md:border-l border-ind-border pt-3 md:pt-0 md:pl-6">
                <div className="text-xs md:text-sm font-semibold text-ind-text-muted mb-1 tracking-wide">Est. Lifespan</div>
                <div className={`text-lg md:text-xl font-mono font-bold ${pred.estimatedDaysRemaining < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {pred.estimatedDaysRemaining}
                  <span className="text-xs md:text-sm text-ind-text-dim ml-1">d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
