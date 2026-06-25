import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSearch } from "../context/SearchContext";
import api from "../utils/api";

const SORT_OPTIONS = [
  { label: "Featured",     value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A–Z",    value: "name-asc" },
];

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-100 dark:bg-gray-800" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-2/5 mt-1" />
      <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-xl mt-2" />
    </div>
  </div>
);

const Products = () => {
  const { searchQuery } = useSearch();
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [category,    setCategory]    = useState("all");
  const [maxPrice,    setMaxPrice]    = useState(0);
  const [priceMax,    setPriceMax]    = useState(0);
  const [sort,        setSort]        = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/products/v1/");
        if (!data.success) throw new Error(data.message || "Failed to load products");
        const list = data.data || [];
        setProducts(list);
        const top = Math.ceil(Math.max(...list.map(p => p.price), 0) / 100) * 100 || 10000;
        setPriceMax(top); setMaxPrice(top);
      } catch (e) { setError(e.response?.data?.message || e.message); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const categories = useMemo(() => {
    const map = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const q = searchQuery.toLowerCase();
      return (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
        && (category === "all" || p.category === category)
        && p.price <= maxPrice;
    });
    if (sort === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name-asc")   list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, searchQuery, category, maxPrice, sort]);

  const handleReset = () => { setCategory("all"); setMaxPrice(priceMax); setSort("default"); };
  const activeFilters = (category !== "all" ? 1 : 0) + (maxPrice < priceMax ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* ── Hero banner ── */}
      {!searchQuery && (
        <div className="bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-700 dark:via-indigo-600 dark:to-violet-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex items-center justify-between gap-6">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">New arrivals every week</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Discover Premium Products
              </h1>
              <p className="text-indigo-200 mt-2 text-sm max-w-md">
                Quality goods at unbeatable prices — free shipping on every order.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 shrink-0">
              {[{ icon: "🚚", text: "Free Shipping" }, { icon: "↩️", text: "Easy Returns" }, { icon: "🔒", text: "Secure Pay" }].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                  <span className="text-xl">{icon}</span>
                  <span className="text-xs text-indigo-100 font-medium whitespace-nowrap">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : category !== "all"
                  ? <span className="capitalize">{category}</span>
                  : "All Products"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="hidden sm:block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Mobile filter button */}
            <button onClick={() => setSidebarOpen(v => !v)}
              className="lg:hidden relative flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {activeFilters > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-7">

          {/* Sidebar */}
          <div className={`${sidebarOpen ? "block" : "hidden"} lg:block shrink-0`}>
            <FilterSidebar
              categories={categories}
              selected={category}
              onSelect={(c) => { setCategory(c); setSidebarOpen(false); }}
              priceRange={[0, maxPrice, priceMax]}
              onPriceChange={setMaxPrice}
              onReset={handleReset}
              totalCount={products.length}
            />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-500">{error}</p>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-300">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term</p>
                </div>
                <button onClick={handleReset}
                  className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Clear all filters
                </button>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
                  Showing {filtered.length} of {products.length} products
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;

