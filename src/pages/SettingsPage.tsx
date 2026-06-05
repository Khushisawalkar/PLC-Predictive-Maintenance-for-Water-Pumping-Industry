import { Settings, Network, Database, Shield } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="bg-[#070d13] border border-[#1e2d3d] rounded h-full p-6 flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center gap-3 border-b border-[#1e2d3d] pb-4">
        <Settings className="text-[#4a6070]" />
        <h2 className="text-lg font-bold text-[#c0d0e0] tracking-wide">SYSTEM CONFIGURATION</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Network Config */}
        <div className="border border-[#1e2d3d] rounded p-4 bg-[#0a1118]">
          <div className="flex items-center gap-2 text-sm md:text-base font-semibold tracking-wide text-[#8a9aaa] mb-4">
            <Network className="w-4 h-4 md:w-5 md:h-5" /> NETWORK PROTOCOLS
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">PLC Communication</span>
              <select className="bg-[#060b12] border border-[#1e2d3d] rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-[#c0d0e0] outline-none">
                <option>Modbus TCP/IP</option>
                <option>OPC UA</option>
                <option>Ethernet/IP</option>
                <option>MQTT</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">IP Address</span>
              <input type="text" value="192.168.1.100" readOnly className="bg-[#060b12] border border-[#1e2d3d] rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-[#c0d0e0] outline-none w-28 md:w-36 text-right" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Port</span>
              <input type="text" value="502" readOnly className="bg-[#060b12] border border-[#1e2d3d] rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-[#c0d0e0] outline-none w-16 md:w-24 text-right" />
            </div>
          </div>
        </div>

        {/* Database Config */}
        <div className="border border-[#1e2d3d] rounded p-4 bg-[#0a1118]">
          <div className="flex items-center gap-2 text-sm md:text-base font-semibold tracking-wide text-[#8a9aaa] mb-4">
            <Database className="w-4 h-4 md:w-5 md:h-5" /> DATA LOGGING
          </div>
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Storage Interval</span>
              <select className="bg-[#060b12] border border-[#1e2d3d] rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-[#c0d0e0] outline-none">
                <option>1 Second</option>
                <option>5 Seconds</option>
                <option>1 Minute</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Retention Policy</span>
              <select className="bg-[#060b12] border border-[#1e2d3d] rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-[#c0d0e0] outline-none">
                <option>30 Days</option>
                <option>90 Days</option>
                <option>1 Year</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Backend URI</span>
              <input type="text" value="mongodb://localhost:27017" readOnly className="bg-[#060b12] border border-[#1e2d3d] rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-[#c0d0e0] outline-none w-40 md:w-56 text-right opacity-50" />
            </div>
          </div>
        </div>

        {/* Threshold Config */}
        <div className="border border-[#1e2d3d] rounded p-4 bg-[#0a1118] md:col-span-2">
          <div className="flex items-center gap-2 text-sm md:text-base font-semibold tracking-wide text-[#8a9aaa] mb-4">
            <Shield className="w-4 h-4 md:w-5 md:h-5" /> ALARM THRESHOLDS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-3">
                <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Winding Temp (°C)</span>
                <div className="flex gap-2">
                  <input type="text" value="70" readOnly className="bg-[#1e2d3d]/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="80" readOnly className="bg-[#1e2d3d]/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-3">
                <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Bearing Temp (°C)</span>
                <div className="flex gap-2">
                  <input type="text" value="60" readOnly className="bg-[#1e2d3d]/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="70" readOnly className="bg-[#1e2d3d]/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-3">
                <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Ambient Temp (°C)</span>
                <div className="flex gap-2">
                  <input type="text" value="40" readOnly className="bg-[#1e2d3d]/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="-" readOnly className="bg-[#1e2d3d]/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-3">
                <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Current (A)</span>
                <div className="flex gap-2">
                  <input type="text" value="18" readOnly className="bg-[#1e2d3d]/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="22" readOnly className="bg-[#1e2d3d]/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-3">
                <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Speed (RPM)</span>
                <div className="flex gap-2">
                  <input type="text" value="2500" readOnly className="bg-[#1e2d3d]/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="2800" readOnly className="bg-[#1e2d3d]/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-3">
                <span className="text-xs md:text-sm font-medium text-[#c0d0e0]">Health Index</span>
                <div className="flex gap-2">
                  <input type="text" value="0.6" readOnly className="bg-[#1e2d3d]/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="0.8" readOnly className="bg-[#1e2d3d]/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-[10px] md:text-xs text-[#8a9aaa] text-center italic">
            * Thresholds are locked in Simulation Mode. Connect real hardware to modify.
          </div>
        </div>
      </div>
    </div>
  );
}
