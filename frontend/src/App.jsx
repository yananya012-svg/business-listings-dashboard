import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import CityChart from './components/CityChart';
import CategoryChart from './components/CategoryChart';
import SourceChart from './components/SourceChart';
import ListingsTable from './components/ListingsTable';
import DatabaseView from './components/DatabaseView';

import {
  fetchHealth,
  fetchSummary,
  fetchCityAnalytics,
  fetchCategoryAnalytics,
  fetchSourceAnalytics,
  fetchFilterOptions,
  fetchListings
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dbStatus, setDbStatus] = useState('connecting');
  const [refreshing, setRefreshing] = useState(false);

  // Analytics states
  const [summary, setSummary] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Filter options
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);

  // Listings state
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState(null);

  // Load high level analytics and options
  const loadAnalytics = useCallback(async () => {
    setChartsLoading(true);
    try {
      // Check health
      try {
        const health = await fetchHealth();
        setDbStatus(health.status === 'healthy' ? 'healthy' : 'degraded');
      } catch (e) {
        setDbStatus('error');
      }

      // Fetch summary & charts in parallel
      const [sumRes, cityRes, catRes, srcRes, optRes] = await Promise.all([
        fetchSummary(),
        fetchCityAnalytics(),
        fetchCategoryAnalytics(),
        fetchSourceAnalytics(),
        fetchFilterOptions()
      ]);

      setSummary(sumRes);
      setCityData(cityRes);
      setCategoryData(catRes);
      setSourceData(srcRes);
      setCities(optRes.cities || []);
      setCategories(optRes.categories || []);
      setSources(optRes.sources || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setChartsLoading(false);
    }
  }, []);

  // Load paginated listings with search & filters
  const loadListingsData = useCallback(async () => {
    setTableLoading(true);
    setTableError(null);
    try {
      const data = await fetchListings({
        page,
        pageSize,
        search,
        city: cityFilter,
        category: categoryFilter,
        source: sourceFilter
      });
      setListings(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setTableError(err.message || 'Failed to connect to backend server');
    } finally {
      setTableLoading(false);
    }
  }, [page, pageSize, search, cityFilter, categoryFilter, sourceFilter]);

  // Initial load
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Debounced search / filter reload
  useEffect(() => {
    const timer = setTimeout(() => {
      loadListingsData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadListingsData]);

  // Reset page to 1 when search or filter changes
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleCityFilterChange = (val) => {
    setCityFilter(val);
    setPage(1);
  };

  const handleCategoryFilterChange = (val) => {
    setCategoryFilter(val);
    setPage(1);
  };

  const handleSourceFilterChange = (val) => {
    setSourceFilter(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCityFilter('');
    setCategoryFilter('');
    setSourceFilter('');
    setPage(1);
  };

  // Manual full refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadAnalytics(), loadListingsData()]);
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          dbStatus={dbStatus}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          activeTab={activeTab}
        />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <>
              {/* Summary KPI Cards */}
              <MetricCards summary={summary} loading={chartsLoading} />

              {/* Grid of Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CityChart data={cityData} loading={chartsLoading} />
                <CategoryChart data={categoryData} loading={chartsLoading} />
              </div>

              {/* Source-wise Donut Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <SourceChart data={sourceData} loading={chartsLoading} />
                </div>
                <div className="lg:col-span-2">
                  <ListingsTable
                    listings={listings}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onPageSizeChange={(newSize) => {
                      setPageSize(newSize);
                      setPage(1);
                    }}
                    search={search}
                    onSearchChange={handleSearchChange}
                    cityFilter={cityFilter}
                    onCityFilterChange={handleCityFilterChange}
                    categoryFilter={categoryFilter}
                    onCategoryFilterChange={handleCategoryFilterChange}
                    sourceFilter={sourceFilter}
                    onSourceFilterChange={handleSourceFilterChange}
                    cities={cities}
                    categories={categories}
                    sources={sources}
                    loading={tableLoading}
                    error={tableError}
                    onResetFilters={handleResetFilters}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <MetricCards summary={summary} loading={chartsLoading} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CityChart data={cityData} loading={chartsLoading} />
                <CategoryChart data={categoryData} loading={chartsLoading} />
              </div>
              <div className="max-w-xl">
                <SourceChart data={sourceData} loading={chartsLoading} />
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <ListingsTable
              listings={listings}
              total={total}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              search={search}
              onSearchChange={handleSearchChange}
              cityFilter={cityFilter}
              onCityFilterChange={handleCityFilterChange}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={handleCategoryFilterChange}
              sourceFilter={sourceFilter}
              onSourceFilterChange={handleSourceFilterChange}
              cities={cities}
              categories={categories}
              sources={sources}
              loading={tableLoading}
              error={tableError}
              onResetFilters={handleResetFilters}
            />
          )}

          {activeTab === 'database' && (
            <DatabaseView summary={summary} />
          )}
        </main>
      </div>
    </div>
  );
}
