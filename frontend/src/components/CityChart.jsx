import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MapPin } from 'lucide-react';

const COLORS = [
  '#4f46e5', '#6366f1', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#10b981', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
        <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
        </div>
        <div className="text-sm font-bold text-white font-mono">
          {payload[0].value} <span className="text-slate-400 font-normal text-xs">Listings</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function CityChart({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-slate-400">Loading city analytics...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col justify-center items-center">
        <MapPin className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-500">No city data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            City-Wise Listings Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Top regional business clusters (MySQL GROUP BY)</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
          {data.length} Cities
        </span>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="city"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              angle={-25}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
