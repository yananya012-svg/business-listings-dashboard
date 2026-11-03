import React from 'react';
import { RefreshCw, Database, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Header({ dbStatus, onRefresh, refreshing, activeTab }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Executive Dashboard Overview';
      case 'analytics':
        return 'Deep-Dive Business Analytics';
      case 'listings':
        return 'Directory Master Listings';
      case 'database':
        return 'MySQL Schema & Ingestion Status';
      default:
        return 'Business Listings Dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {getTabTitle()}
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Live Sync
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time analytics engine powered by FastAPI & MySQL Server 8.0
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* System Health Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            dbStatus === 'healthy'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {dbStatus === 'healthy' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>{dbStatus === 'healthy' ? 'MySQL 8.0 Live' : 'API Connecting...'}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>
    </header>
  );
}
