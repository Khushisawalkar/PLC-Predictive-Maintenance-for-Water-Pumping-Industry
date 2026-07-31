import { Info, Cpu, Server, Database, Monitor, ArrowDown } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="bg-ind-card border border-ind-border rounded h-full flex flex-col overflow-y-auto p-6">
      <div className="flex items-center gap-3 border-b border-ind-border pb-4 mb-6 shrink-0">
        <Info className="text-ind-text-dim" />
        <h2 className="text-base md:text-lg font-bold text-ind-text tracking-wide">Project Architecture</h2>
      </div>

      <div className="flex flex-col gap-6 items-center w-full max-w-3xl mx-auto pb-8">
        
        <div className="text-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-cyan-400 mb-2">PLC Predictive Maintenance</h1>
          <h2 className="text-sm md:text-base text-ind-text-muted">for Water Pumping Industry</h2>
          <p className="text-xs md:text-sm text-ind-text-muted mt-4 max-w-xl mx-auto leading-relaxed">
            This SCADA/HMI frontend simulates an industrial environment where sensor data is processed to predict equipment failures and automate protective actions.
          </p>
        </div>

        {/* Architecture Flow */}
        <div className="flex flex-col items-center gap-2 w-full">
          
          <div className="w-full max-w-md bg-ind-card-hover border border-cyan-500/30 rounded-lg p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(6,182,212,0.1)] relative">
             <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-400"><Cpu size={24} /></div>
             <div>
               <div className="font-bold text-sm md:text-base text-ind-text">Industrial Sensors & ESP32</div>
               <div className="text-xs md:text-sm text-ind-text-muted">Temperature, Current, Speed</div>
             </div>
             <div className="absolute top-2 right-2 flex gap-1">
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute"></span>
             </div>
          </div>

          <ArrowDown className="text-ind-text-dim" />

          <div className="w-full max-w-md bg-ind-card-hover border border-emerald-500/30 rounded-lg p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative">
             <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400"><Server size={24} /></div>
             <div>
               <div className="font-bold text-sm md:text-base text-ind-text">Industrial PLC</div>
               <div className="text-xs md:text-sm text-ind-text-muted">Mitsubishi / Siemens / Allen Bradley</div>
             </div>
          </div>

          <ArrowDown className="text-ind-text-dim" />

          <div className="w-full max-w-md flex gap-4">
             <div className="flex-1 bg-ind-card-hover border border-purple-500/30 rounded-lg p-4 flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
               <div className="p-2 bg-purple-500/10 rounded-full text-purple-400"><Server className="w-4 h-4 md:w-5 md:h-5" /></div>
               <div className="font-bold text-xs md:text-sm text-ind-text text-center">Node.js + Express<br/><span className="text-xs text-ind-text-muted font-normal">Backend API</span></div>
             </div>
             <div className="flex-1 bg-ind-card-hover border border-orange-500/30 rounded-lg p-4 flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
               <div className="p-2 bg-orange-500/10 rounded-full text-orange-400"><Database className="w-4 h-4 md:w-5 md:h-5" /></div>
               <div className="font-bold text-xs md:text-sm text-ind-text text-center">MongoDB Server<br/><span className="text-xs text-ind-text-muted font-normal">Database</span></div>
             </div>
          </div>

          <ArrowDown className="text-ind-text-dim" />

          <div className="w-full max-w-md bg-ind-card-active border-2 border-blue-500/50 rounded-lg p-4 flex items-center gap-4 shadow-[0_0_20px_rgba(59,130,246,0.2)] relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
             <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 z-10"><Monitor size={24} /></div>
             <div className="z-10">
               <div className="font-bold text-sm md:text-base text-ind-text">React SCADA Dashboard</div>
               <div className="text-xs md:text-sm text-ind-text">Current Interface layer</div>
             </div>
          </div>

        </div>

        {/* Hardware Bill of Materials */}
        <div className="w-full max-w-md mt-8">
          <div className="flex items-center gap-2 mb-4 border-b border-ind-border pb-2">
            <Cpu size={16} className="text-ind-text-dim" />
            <h3 className="text-xs md:text-sm font-bold text-ind-text tracking-wide">Hardware Implementation (BOM)</h3>
          </div>
          <div className="bg-ind-card-hover border border-ind-border rounded-lg overflow-hidden">
            <table className="w-full text-xs md:text-sm font-mono text-left">
              <thead className="bg-ind-card-active border-b border-ind-border text-ind-text-muted">
                <tr>
                  <th className="p-3 font-normal">Component</th>
                  <th className="p-3 font-normal text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="text-ind-text divide-y divide-[#1e2d3d]">
                <tr className="hover:bg-ind-card-active/50">
                  <td className="p-3">MAX6675 K TYPE</td>
                  <td className="p-3 text-right">1</td>
                </tr>
                <tr className="hover:bg-ind-card-active/50">
                  <td className="p-3">PT100 RTD</td>
                  <td className="p-3 text-right">1</td>
                </tr>
                <tr className="hover:bg-ind-card-active/50">
                  <td className="p-3">SCT-031-030</td>
                  <td className="p-3 text-right">2</td>
                </tr>
                <tr className="hover:bg-ind-card-active/50">
                  <td className="p-3">M12 PNP NO Inductive</td>
                  <td className="p-3 text-right">2</td>
                </tr>
                <tr className="hover:bg-ind-card-active/50">
                  <td className="p-3">DB18B20</td>
                  <td className="p-3 text-right">1</td>
                </tr>
                <tr className="hover:bg-ind-card-active/50">
                  <td className="p-3">Power 12V</td>
                  <td className="p-3 text-right">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
