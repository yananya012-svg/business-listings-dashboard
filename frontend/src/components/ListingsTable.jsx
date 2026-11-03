import React from 'react';
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Building2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  Copy,
  Check,
  Radio
} from 'lucide-react';

export default function ListingsTable({
  listings,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  search,
  onSearchChange,
  cityFilter,
  onCityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sourceFilter,
  onSourceFilterChange,
  cities,
  categories,
  sources,
  loading,
  error,
  onResetFilters
}) {
  const [copiedId, setCopiedId] = React.useState(null);

  const handleCopyPhone = (phone, id) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header and Control Toolbar */}
      <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Business Directory Master
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time server-paginated listings from MySQL database
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, address..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* City Filter */}
          <div className="relative">
            <select
              value={cityFilter}
              onChange={(e) => onCityFilterChange(e.target.value)}
              className="appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer"
            >
              <option value="">All Cities ({cities.length})</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer max-w-[180px] truncate"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Layers className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Source Filter */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => onSourceFilterChange(e.target.value)}
              className="appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer max-w-[170px] truncate"
            >
              <option value="">All Sources ({sources?.length || 0})</option>
              {sources?.map((src) => (
                <option key={src} value={src}>
                  {src.replace('Synthetic - ', '')}
                </option>
              ))}
            </select>
            <Radio className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {(search || cityFilter || categoryFilter || sourceFilter) && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-2 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto min-h-[360px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col justify-center items-center z-10">
            <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-semibold text-slate-600">Querying MySQL listings...</p>
          </div>
        )}

        {error ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Failed to load listings</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md">{error}</p>
          </div>
        ) : listings.length === 0 && !loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No matching business listings</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or resetting active filters.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-4 px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[180px]">Business Name</th>
                <th className="py-3 px-4 min-w-[140px]">Category</th>
                <th className="py-3 px-4 min-w-[100px]">City</th>
                <th className="py-3 px-4 min-w-[220px]">Address</th>
                <th className="py-3 px-4 min-w-[130px]">Phone</th>
                <th className="py-3 px-4 min-w-[140px]">Source</th>
                <th className="py-3 px-4 min-w-[95px]">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {listings.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.business_name}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item.city}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] leading-relaxed max-w-[260px] truncate" title={item.address}>
                    {item.address}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {item.phone ? (
                      <button
                        onClick={() => handleCopyPhone(item.phone, item.id)}
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition"
                        title="Click to copy phone number"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{item.phone}</span>
                        {copiedId === item.id ? (
                          <Check className="w-3 h-3 text-emerald-600 ml-0.5" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 text-slate-400 ml-0.5 opacity-0 group-hover:opacity-100" />
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">Not Provided</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {item.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-700 font-mono">{listings.length > 0 ? (page - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-slate-700 font-mono">{Math.min(page * pageSize, total)}</strong> of{' '}
            <strong className="text-slate-700 font-mono">{total}</strong> listings
          </span>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg font-mono">
            Page {page} of {totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
