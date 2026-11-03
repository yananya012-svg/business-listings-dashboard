import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Building2, 
  Database, 
  Layers, 
  MapPin, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, dbStatus }) {
  const navItems = [
    { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
    { id: 'analytics', label: 'Visual Analytics', icon: BarChart3 },
    { id: 'listings', label: 'Listings Directory', icon: Building2 },
    { id: 'database', label: 'Database & Schema', icon: Database },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base tracking-tight leading-none">BizDirectory</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Enterprise Analytics</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 py-5 flex-1 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Main Dashboard
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-indigo-200" />}
            </button>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          System Info
        </div>
        <div className="px-3 py-2 text-xs text-slate-400 space-y-2 bg-slate-800/40 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Database:</span>
            <span className="text-white font-mono text-[11px]">MySQL 8.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Backend:</span>
            <span className="text-white font-mono text-[11px]">FastAPI (Py)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Frontend:</span>
            <span className="text-white font-mono text-[11px]">React + Vite</span>
          </div>
        </div>
      </div>

      {/* DB Connection Status Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dbStatus === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-slate-300 font-medium">
              {dbStatus === 'healthy' ? 'Database Connected' : 'Connecting to API...'}
            </span>
          </div>
          <ShieldCheck className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
