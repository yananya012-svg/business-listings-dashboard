const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
  return res.json();
}

export async function fetchSummary() {
  const res = await fetch(`${API_BASE_URL}/api/analytics/summary`);
  if (!res.ok) throw new Error(`Summary API failed with status ${res.status}`);
  return res.json();
}

export async function fetchCityAnalytics() {
  const res = await fetch(`${API_BASE_URL}/api/analytics/city`);
  if (!res.ok) throw new Error(`City analytics API failed with status ${res.status}`);
  return res.json();
}

export async function fetchCategoryAnalytics() {
  const res = await fetch(`${API_BASE_URL}/api/analytics/category`);
  if (!res.ok) throw new Error(`Category analytics API failed with status ${res.status}`);
  return res.json();
}

export async function fetchSourceAnalytics() {
  const res = await fetch(`${API_BASE_URL}/api/analytics/source`);
  if (!res.ok) throw new Error(`Source analytics API failed with status ${res.status}`);
  return res.json();
}

export async function fetchFilterOptions() {
  const res = await fetch(`${API_BASE_URL}/api/filter-options`);
  if (!res.ok) throw new Error(`Filter options API failed with status ${res.status}`);
  return res.json();
}

export async function fetchListings({
  page = 1,
  pageSize = 10,
  search = '',
  city = '',
  category = '',
  source = '',
  sortBy = 'created_at',
  sortOrder = 'desc'
} = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('page_size', pageSize);
  if (search) params.set('search', search);
  if (city) params.set('city', city);
  if (category) params.set('category', category);
  if (source) params.set('source', source);
  if (sortBy) params.set('sort_by', sortBy);
  if (sortOrder) params.set('sort_order', sortOrder);

  const res = await fetch(`${API_BASE_URL}/api/listings?${params.toString()}`);
  if (!res.ok) throw new Error(`Listings API failed with status ${res.status}`);
  return res.json();
}
