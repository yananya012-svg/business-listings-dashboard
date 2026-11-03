import React from 'react';
import { Building2, MapPin, Layers, Radio, TrendingUp, Sparkles } from 'lucide-react';

export default function MetricCards({ summary, loading }) {
  const cards = [
    {
      title: 'Total Business Listings',
      value: summary?.total_listings ?? 0,
      icon: Building2,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'Active database records',
      tag: '100% Verified'
    },
    {
      title: 'Geographic Presence',
      value: summary?.total_cities ?? 0,
      suffix: ' Cities',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      description: 'Metropolitan markets covered',
      tag: 'Pan-India'
    },
    {
      title: 'Industry Categories',
      value: summary?.total_categories ?? 0,
      suffix: ' Sectors',
      icon: Layers,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50 text-violet-600 border-violet-200',
      description: 'Distinct business verticals',
      tag: 'Multi-industry'
    },
    {
      title: 'Acquisition Channels',
      value: summary?.total_sources ?? 0,
      suffix: ' Sources',
      icon: Radio,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
      description: 'Sample data origin channels',
      tag: 'Audited'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="w-16 h-5 bg-slate-100 rounded-full"></div>
            </div>
            <div className="w-24 h-8 bg-slate-200 rounded-md mb-2"></div>
            <div className="w-32 h-4 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top Accent Gradient Border */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`} />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm ${card.bgColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {card.tag}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {card.title}
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </span>
                {card.suffix && (
                  <span className="text-xs font-medium text-slate-500">{card.suffix}</span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{card.description}</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
