import { useState } from 'react';
import { Settings, Network, Database, Shield } from 'lucide-react';
import { getApiUrl } from '../services/api';

export function SettingsPage() {
  const apiUrl = getApiUrl();
  const [speedWarning, setSpeedWarning] = useState(localStorage.getItem('speedWarning') || "2500");
  const [speedFault, setSpeedFault] = useState(localStorage.getItem('speedFault') || "2800");

  const updateThreshold = (key: string, val: string, setter: any) => {
    setter(val);
    localStorage.setItem(key, val);
  };

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
              <span className="text-xs md:text-sm font-medium text-ind-text">Communication Protocol</span>
              <select className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none">
                <option>HTTP REST API (ESP32)</option>
                <option>MQTT / WebSockets</option>
                <option>Modbus TCP/IP</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-ind-text">Active Backend URL</span>
              <input type="text" value={apiUrl} readOnly className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none w-48 md:w-64 text-right" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-medium text-ind-text">Auto-Discovery</span>
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 rounded px-3 py-1 text-[10px] md:text-xs font-mono">Enabled</span>
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
              <span className="text-xs md:text-sm font-medium text-ind-text">Active Database</span>
              <input type="text" value="Auto (MongoDB / Memory)" readOnly className="bg-ind-bg border border-ind-border rounded px-3 py-1.5 text-[10px] md:text-xs lg:text-sm font-mono text-ind-text outline-none w-48 md:w-56 text-right opacity-50" />
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
                  <input type="text" value={speedWarning} onChange={(e) => updateThreshold('speedWarning', e.target.value, setSpeedWarning)} className="bg-ind-bg hover:bg-ind-border/30 focus:bg-ind-border/50 border border-amber-500/50 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-amber-400 w-12 md:w-16 text-center outline-none cursor-text transition-colors" title="Warning" />
                  <input type="text" value={speedFault} onChange={(e) => updateThreshold('speedFault', e.target.value, setSpeedFault)} className="bg-ind-bg hover:bg-ind-border/30 focus:bg-ind-border/50 border border-red-500/50 rounded px-2 py-1 text-[10px] md:text-xs font-mono text-red-400 w-12 md:w-16 text-center outline-none cursor-text transition-colors" title="Fault" />
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
            * Speed thresholds are now editable. Click the numbers to change them according to your ESP code.
          </div>
        </div>
      </div>
    </div>
  );
}
