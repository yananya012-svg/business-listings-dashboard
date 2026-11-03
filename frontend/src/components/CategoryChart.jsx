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
import { Layers } from 'lucide-react';

const CATEGORY_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
        <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
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

export default function CategoryChart({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-slate-400">Loading industry sectors...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col justify-center items-center">
        <Layers className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-500">No category data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            Category-Wise Listings Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Industry vertical segmentation (MySQL GROUP BY)</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-100">
          {data.length} Verticals
        </span>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 45, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="category"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#475569', fontSize: 11 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {data.map((entry, index) => (
                <Cell key={`cat-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
