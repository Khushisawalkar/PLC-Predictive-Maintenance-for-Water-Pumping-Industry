import { Info, Cpu, Server, Database, Monitor, ArrowDown } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="bg-[#070d13] border border-[#1e2d3d] rounded h-full flex flex-col overflow-y-auto p-6">
      <div className="flex items-center gap-3 border-b border-[#1e2d3d] pb-4 mb-6 shrink-0">
        <Info className="text-[#4a6070]" />
        <h2 className="text-lg font-mono font-bold text-[#c0d0e0]">PROJECT ARCHITECTURE</h2>
      </div>

      <div className="flex flex-col gap-6 items-center w-full max-w-3xl mx-auto pb-8">
        
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-cyan-400 mb-2">PLC Predictive Maintenance</h1>
          <h2 className="text-sm text-[#8a9aaa] font-mono">for Water Pumping Industry</h2>
          <p className="text-xs text-[#4a6070] mt-4 max-w-xl mx-auto">
            This SCADA/HMI frontend simulates an industrial environment where sensor data is processed to predict equipment failures and automate protective actions.
          </p>
        </div>

        {/* Architecture Flow */}
        <div className="flex flex-col items-center gap-2 w-full">
          
          <div className="w-full max-w-md bg-[#0a1118] border border-cyan-500/30 rounded-lg p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(6,182,212,0.1)] relative">
             <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-400"><Cpu size={24} /></div>
             <div>
               <div className="font-mono font-bold text-sm text-[#c0d0e0]">Industrial Sensors & ESP32</div>
               <div className="font-mono text-xs text-[#4a6070]">Temperature, Vibration, Current, Oil</div>
             </div>
             <div className="absolute top-2 right-2 flex gap-1">
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute"></span>
             </div>
          </div>

          <ArrowDown className="text-[#3a4a5a]" />

          <div className="w-full max-w-md bg-[#0a1118] border border-emerald-500/30 rounded-lg p-4 flex items-center gap-4 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative">
             <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400"><Server size={24} /></div>
             <div>
               <div className="font-mono font-bold text-sm text-[#c0d0e0]">Industrial PLC</div>
               <div className="font-mono text-xs text-[#4a6070]">Mitsubishi / Siemens / Allen Bradley</div>
             </div>
          </div>

          <ArrowDown className="text-[#3a4a5a]" />

          <div className="w-full max-w-md flex gap-4">
             <div className="flex-1 bg-[#0a1118] border border-purple-500/30 rounded-lg p-4 flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
               <div className="p-2 bg-purple-500/10 rounded-full text-purple-400"><Server size={20} /></div>
               <div className="font-mono font-bold text-xs text-[#c0d0e0] text-center">Node.js + Express<br/><span className="text-[10px] text-[#4a6070]">Backend API</span></div>
             </div>
             <div className="flex-1 bg-[#0a1118] border border-green-500/30 rounded-lg p-4 flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
               <div className="p-2 bg-green-500/10 rounded-full text-green-400"><Database size={20} /></div>
               <div className="font-mono font-bold text-xs text-[#c0d0e0] text-center">MongoDB<br/><span className="text-[10px] text-[#4a6070]">Data Storage</span></div>
             </div>
          </div>

          <ArrowDown className="text-[#3a4a5a]" />

          <div className="w-full max-w-md bg-[#0d1520] border-2 border-blue-500/50 rounded-lg p-4 flex items-center gap-4 shadow-[0_0_20px_rgba(59,130,246,0.2)] relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
             <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 z-10"><Monitor size={24} /></div>
             <div className="z-10">
               <div className="font-mono font-bold text-sm text-[#c0d0e0]">React SCADA Dashboard</div>
               <div className="font-mono text-xs text-[#8a9aaa]">Current Interface layer</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
