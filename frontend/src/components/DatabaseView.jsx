import React from 'react';
import { Database, Table, Key, ShieldCheck, Check, Terminal, Layers } from 'lucide-react';

export default function DatabaseView({ summary }) {
  const columns = [
    { name: 'id', type: 'INT', key: 'PRI', nullable: 'NO', extra: 'AUTO_INCREMENT', desc: 'Primary identification key' },
    { name: 'business_name', type: 'VARCHAR(255)', key: 'UNI (1/3)', nullable: 'NO', extra: 'INDEXED', desc: 'Commercial brand or trading name' },
    { name: 'category', type: 'VARCHAR(100)', key: 'MUL', nullable: 'NO', extra: 'INDEXED', desc: 'Industry sector classification' },
    { name: 'city', type: 'VARCHAR(100)', key: 'MUL', nullable: 'NO', extra: 'INDEXED', desc: 'Metropolitan hub' },
    { name: 'address', type: 'VARCHAR(500)', key: 'UNI (3/3)', nullable: 'NO', extra: 'PARTIAL INDEX', desc: 'Detailed physical office/store address' },
    { name: 'phone', type: 'VARCHAR(50)', key: '-', nullable: 'YES', extra: 'NULLABLE', desc: 'Direct contact phone number' },
    { name: 'source', type: 'VARCHAR(100)', key: 'MUL', nullable: 'NO', extra: 'INDEXED', desc: 'Ingestion pipeline origin' },
    { name: 'created_at', type: 'DATETIME', key: '-', nullable: 'NO', extra: 'DEFAULT CURRENT_TIMESTAMP', desc: 'Creation and indexing timestamp' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Target Database</div>
            <div className="text-base font-bold text-slate-900 font-mono mt-0.5">business_dashboard</div>
            <div className="text-xs text-slate-500 mt-1">MySQL Server 8.0 (InnoDB utf8mb4)</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Primary Entity</div>
            <div className="text-base font-bold text-slate-900 font-mono mt-0.5">listing_master</div>
            <div className="text-xs text-slate-500 mt-1">{summary?.total_listings ?? 560} Records Loaded</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Duplicate Prevention</div>
            <div className="text-base font-bold text-slate-900 font-mono mt-0.5">Composite Uniqueness</div>
            <div className="text-xs text-slate-500 mt-1">(business_name, city, address)</div>
          </div>
        </div>
      </div>

      {/* Schema Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Schema Architecture (`listing_master`)</h3>
            <p className="text-xs text-slate-500 mt-0.5">SQLAlchemy 2.0 ORM & MySQL DDL mapping</p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-semibold">
            8 Columns
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Column Name</th>
                <th className="py-3 px-4">Data Type</th>
                <th className="py-3 px-4">Key / Constraint</th>
                <th className="py-3 px-4">Nullable</th>
                <th className="py-3 px-4">Index / Extra</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {columns.map((col) => (
                <tr key={col.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">{col.name}</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 font-medium">{col.type}</td>
                  <td className="py-3 px-4">
                    {col.key === 'PRI' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Key className="w-3 h-3" /> PRIMARY
                      </span>
                    ) : col.key.startsWith('UNI') ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {col.key}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">{col.key}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono text-[11px] ${col.nullable === 'NO' ? 'text-slate-700 font-semibold' : 'text-slate-400 italic'}`}>
                      {col.nullable}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{col.extra}</td>
                  <td className="py-3 px-4 text-slate-500">{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Command Reference */}
      <div className="bg-slate-900 rounded-2xl p-6 text-slate-200 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <h4 className="text-sm font-bold text-white">Automated CSV Ingestion Script</h4>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          The project includes an idempotent Python import script that reads <code className="text-indigo-300 font-mono bg-slate-800 px-1 py-0.5 rounded">data/listings.csv</code>, verifies database existence, and performs bulk upsert without duplicating records.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 flex items-center justify-between">
          <code>python backend/import_csv.py</code>
          <span className="text-[11px] text-slate-500 font-sans">Run in terminal</span>
        </div>
      </div>
    </div>
  );
}
