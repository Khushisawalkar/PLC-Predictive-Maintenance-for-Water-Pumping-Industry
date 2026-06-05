import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart2, Bell, Terminal, Wrench,
  Settings, Info, ChevronLeft, ChevronRight, Wifi, WifiOff, Play, Pause, AlertTriangle, Database
} from 'lucide-react';
import { useMonitoring } from './hooks/useMonitoring';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { AlertsPage } from './pages/AlertsPage';
import { SystemLogsPage } from './pages/SystemLogsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

type Page = 'dashboard' | 'analytics' | 'alerts' | 'logs' | 'maintenance' | 'settings' | 'about';

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'analytics' as Page, label: 'Analytics', icon: <BarChart2 size={16} /> },
  { id: 'alerts' as Page, label: 'Alerts', icon: <Bell size={16} /> },
  { id: 'logs' as Page, label: 'System Logs', icon: <Terminal size={16} /> },
  { id: 'maintenance' as Page, label: 'Maintenance', icon: <Wrench size={16} /> },
  { id: 'settings' as Page, label: 'Settings', icon: <Settings size={16} /> },
  { id: 'about' as Page, label: 'About Project', icon: <Info size={16} /> },
];

const pageTitles: Record<Page, string> = {
  dashboard: 'Real-Time Monitoring Dashboard',
  analytics: 'Sensor Analytics & Trends',
  alerts: 'Alert Management System',
  logs: 'System Event Logs',
  maintenance: 'Predictive Maintenance',
  settings: 'System Configuration',
  about: 'Project Architecture',
};

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right">
      <div className="text-xs md:text-sm lg:text-base font-mono font-bold text-cyan-400">{time.toLocaleTimeString('en', { hour12: false })}</div>
      <div className="text-[10px] md:text-xs lg:text-sm text-[#4a6070]">{time.toLocaleDateString('en', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
      else setCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    currentData, history, alerts, logs, deviceStatus, predictions,
    pumpState, pumpMode, isMonitoring,
    pumpRuntime, systemUptime, lastFaultTimestamp,
    acknowledgeAlert, clearAlerts, sendCommand, toggleMode, toggleMonitoring, injectData
  } = useMonitoring();

  const unackedFaults = alerts.filter(a => !a.acknowledged && a.type === 'fault').length;
  const unackedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="flex h-screen bg-[#060b12] text-[#c0d0e0] overflow-hidden">
      <motion.aside
        animate={{ width: collapsed ? 56 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex-shrink-0 bg-[#070d13] border-r border-[#1e2d3d] flex flex-col overflow-hidden z-20"
      >
        <div className="h-14 flex items-center px-3 border-b border-[#1e2d3d] gap-2 shrink-0">
          <div className="w-8 h-8 rounded border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center shrink-0">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-sm md:text-base font-bold text-cyan-400 leading-tight">PLC MONITOR</div>
                <div className="text-xs md:text-sm text-[#4a6070] leading-tight mt-0.5">PREDICTIVE MAINT.</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {navItems.map(item => {
            const active = page === item.id;
            const badge = item.id === 'alerts' && unackedAlerts > 0 ? unackedAlerts : 0;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 mb-0.5 mx-1 rounded-md text-left transition-all relative ${
                  active ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'text-[#4a6070] hover:text-[#8a9aaa] hover:bg-[#0d1520]'
                }`}
                style={{ width: 'calc(100% - 8px)' }}
              >
                <span className="shrink-0">{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm md:text-base truncate">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {badge > 0 && (
                  <span className="absolute top-1 right-1 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(c => !c)}
          className="m-2 p-2 rounded border border-[#1e2d3d] text-[#3a4a5a] hover:text-[#7a8899] transition-all flex items-center justify-center cursor-pointer"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-14 bg-[#070d13] border-b border-[#1e2d3d] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            {unackedFaults > 0 && (
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/40 text-red-400 rounded px-2 py-1 text-[10px] md:text-xs font-bold"
              >
                <AlertTriangle size={12} className="md:w-4 md:h-4" /> {unackedFaults} FAULT{unackedFaults > 1 ? 'S' : ''} ACTIVE
              </motion.div>
            )}
            <div>
              <div className="text-sm md:text-base lg:text-lg font-semibold text-[#c0d0e0]">{pageTitles[page]}</div>
              <div className="text-xs md:text-sm text-[#4a6070] hidden sm:block mt-0.5">Water Pumping Industry — PLC Predictive Maintenance</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMonitoring}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-[10px] md:text-xs font-bold tracking-wide transition-all cursor-pointer shrink-0 ${
                isMonitoring ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0d1117] border-[#1e2d3d] text-[#4a5568]'
              }`}
            >
              {isMonitoring ? <><Play className="w-3 h-3 md:w-4 md:h-4" /> LIVE</> : <><Pause className="w-3 h-3 md:w-4 md:h-4" /> PAUSED</>}
            </button>
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              {deviceStatus.esp32 === 'online' ? <Wifi size={14} className="text-emerald-400" /> : <WifiOff size={14} className="text-red-400" />}
              <span className="text-xs md:text-sm text-[#4a6070]">{deviceStatus.plcBrand}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              <Database size={14} className={deviceStatus.database === 'online' ? "text-orange-400" : "text-red-400"} />
              <span className="text-xs md:text-sm text-[#4a6070]">MySQL</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-[10px] md:text-xs font-bold shrink-0 ${
              currentData.status === 'healthy' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
              currentData.status === 'warning' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
              'border-red-500/40 text-red-400 bg-red-500/10'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                currentData.status === 'healthy' ? 'bg-emerald-400' : currentData.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
              }`} />
              {currentData.status.toUpperCase()}
            </div>
            <div className="hidden sm:block shrink-0"><Clock /></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2d3d transparent' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {page === 'dashboard' && (
                <Dashboard
                  currentData={currentData} history={history} deviceStatus={deviceStatus}
                  alerts={alerts} pumpState={pumpState} pumpMode={pumpMode}
                  pumpRuntime={pumpRuntime} systemUptime={systemUptime} lastFaultTimestamp={lastFaultTimestamp}
                  predictions={predictions}
                  onCommand={sendCommand} onToggleMode={toggleMode}
                  onAcknowledgeAlert={acknowledgeAlert} onClearAlerts={clearAlerts}
                  onInjectData={injectData}
                  onNavigate={setPage}
                />
              )}
              {page === 'analytics' && <Analytics history={history} currentData={currentData} />}
              {page === 'alerts' && <AlertsPage alerts={alerts} onAcknowledge={acknowledgeAlert} onClear={clearAlerts} />}
              {page === 'logs' && <SystemLogsPage logs={logs} />}
              {page === 'maintenance' && <MaintenancePage predictions={predictions} currentData={currentData} />}
              {page === 'settings' && <SettingsPage />}
              {page === 'about' && <AboutPage />}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="h-8 md:h-10 lg:h-12 bg-[#040810] border-t border-[#1e2d3d] flex items-center px-4 gap-2 sm:gap-4 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="text-[10px] md:text-xs lg:text-sm text-[#4a6070] hidden sm:inline">PLC-PREDICTIVE-MAINTENANCE v1.0.0</span>
          <span className="text-[10px] md:text-xs lg:text-sm text-[#4a6070] hidden sm:inline">|</span>
          <span className="text-[10px] md:text-xs lg:text-sm text-[#4a6070] hidden md:inline">SIMULATION MODE</span>
          <span className="text-[10px] md:text-xs lg:text-sm text-[#4a6070] hidden md:inline">|</span>
          <span className="text-[10px] md:text-xs lg:text-sm text-[#4a6070]">Protocol: <span className="font-mono">{deviceStatus.protocol}</span></span>
          <span className="text-[10px] md:text-xs lg:text-sm text-[#4a6070]">|</span>
          <span className="text-[10px] md:text-xs lg:text-sm text-[#4a6070] hidden sm:inline">Samples: <span className="font-mono">{history.length}</span></span>
          <span className="text-[10px] md:text-xs lg:text-sm text-[#4a6070] hidden sm:inline">|</span>
          <span className={`text-[10px] md:text-xs lg:text-sm ${currentData.status === 'healthy' ? 'text-emerald-600' : currentData.status === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>
            HI: <span className="font-mono font-bold">{currentData.healthIndex.toFixed(3)}</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
