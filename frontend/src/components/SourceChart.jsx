import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Radio } from 'lucide-react';

const SOURCE_COLORS = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899'  // Pink
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
        <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          <span>{data.name}</span>
        </div>
        <div className="text-sm font-bold text-white font-mono">
          {data.value} <span className="text-slate-400 font-normal text-xs">Records ({((data.value / data.payload.total) * 100).toFixed(1)}%)</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SourceChart({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-slate-400">Loading acquisition channels...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col justify-center items-center">
        <Radio className="w-8 h-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-500">No source data available</p>
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  const chartData = data.map((d) => ({
    name: d.source.replace('Synthetic - ', ''),
    fullName: d.source,
    value: d.count,
    total
  }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Source-Wise Ingestion Channels
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Sample dataset channel distribution (MySQL GROUP BY)</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-100">
          {data.length} Channels
        </span>
      </div>

      <div className="h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="48%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`source-cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-xs font-medium text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
