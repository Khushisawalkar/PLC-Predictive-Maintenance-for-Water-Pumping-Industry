import { Settings, Network, Database, Shield } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="bg-ind-card border border-ind-border rounded h-full p-6 flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center gap-3 border-b border-ind-border pb-4">
        <Settings className="text-ind-text-dim" />
        <h2 className="text-lg font-bold text-ind-text tracking-wide">System Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Network Config */}
        <div className="border border-ind-border rounded p-4 bg-ind-card-hover">
          <div className="flex items-center gap-2 text-sm md:text-base font-semibold tracking-wide text-ind-text-muted mb-4">
            <Network className="w-4 h-4 md:w-5 md:h-5" /> Network Protocols
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-ind-text">PLC Communication</span>
              <select className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none">
                <option>Modbus TCP/IP</option>
                <option>OPC UA</option>
                <option>Ethernet/IP</option>
                <option>MQTT</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-ind-text">IP Address</span>
              <input type="text" value="192.168.1.100" readOnly className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none w-28 md:w-36 text-right" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-ind-text">Port</span>
              <input type="text" value="502" readOnly className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none w-16 md:w-24 text-right" />
            </div>
          </div>
        </div>

        {/* Database Config */}
        <div className="border border-ind-border rounded p-4 bg-ind-card-hover">
          <div className="flex items-center gap-2 text-sm md:text-base font-semibold tracking-wide text-ind-text-muted mb-4">
            <Database className="w-4 h-4 md:w-5 md:h-5" /> Data Logging
          </div>
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-ind-text">Storage Interval</span>
              <select className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none">
                <option>1 Second</option>
                <option>5 Seconds</option>
                <option>1 Minute</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-ind-text">Retention Policy</span>
              <select className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none">
                <option>30 Days</option>
                <option>90 Days</option>
                <option>1 Year</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-ind-text">Backend URI</span>
              <input type="text" value="mongodb://localhost:27017" readOnly className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none w-40 md:w-56 text-right opacity-50" />
            </div>
          </div>
        </div>

        {/* Threshold Config */}
        <div className="border border-ind-border rounded p-4 bg-ind-card-hover md:col-span-2">
          <div className="flex items-center gap-2 text-sm md:text-base font-semibold tracking-wide text-ind-text-muted mb-4">
            <Shield className="w-4 h-4 md:w-5 md:h-5" /> Alarm Thresholds
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center border-b border-ind-border pb-3">
                <span className="text-xs md:text-sm font-medium text-ind-text">Winding Temp (°C)</span>
                <div className="flex gap-2">
                  <input type="text" value="70" readOnly className="bg-ind-border/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="80" readOnly className="bg-ind-border/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-ind-border pb-3">
                <span className="text-xs md:text-sm font-medium text-ind-text">Bearing Temp (°C)</span>
                <div className="flex gap-2">
                  <input type="text" value="60" readOnly className="bg-ind-border/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="70" readOnly className="bg-ind-border/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-ind-border pb-3">
                <span className="text-xs md:text-sm font-medium text-ind-text">Ambient Temp (°C)</span>
                <div className="flex gap-2">
                  <input type="text" value="40" readOnly className="bg-ind-border/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="-" readOnly className="bg-ind-border/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-ind-border pb-3">
                <span className="text-xs md:text-sm font-medium text-ind-text">Current (A)</span>
                <div className="flex gap-2">
                  <input type="text" value="18" readOnly className="bg-ind-border/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="22" readOnly className="bg-ind-border/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center border-b border-ind-border pb-3">
                <span className="text-xs md:text-sm font-medium text-ind-text">Speed (RPM)</span>
                <div className="flex gap-2">
                  <input type="text" value="2500" readOnly className="bg-ind-border/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="2800" readOnly className="bg-ind-border/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-ind-border pb-3">
                <span className="text-xs md:text-sm font-medium text-ind-text">Health Index</span>
                <div className="flex gap-2">
                  <input type="text" value="0.6" readOnly className="bg-ind-border/50 border border-amber-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-10 md:w-14 text-center" title="Warning" />
                  <input type="text" value="0.8" readOnly className="bg-ind-border/50 border border-red-500/30 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-10 md:w-14 text-center" title="Fault" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-[10px] md:text-xs text-ind-text-muted text-center italic">
            * Thresholds are locked in Simulation Mode. Connect real hardware to modify.
          </div>
        </div>
      </div>
    </div>
  );
}
