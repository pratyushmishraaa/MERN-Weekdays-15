import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

const STATUS_COLOR = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped:    "bg-blue-100 text-blue-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-600",
};

const PAY_COLOR = {
  pending:   "bg-orange-100 text-orange-600",
  completed: "bg-emerald-100 text-emerald-700",
  failed:    "bg-red-100 text-red-600",
};

const StatCard = ({ label, value, sub, icon, accent }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900 mt-0.5 truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Spinner = () => (
  <div className="flex h-48 items-center justify-center">
    <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
          <div className="h-12 w-12 rounded-2xl bg-gray-100 mb-4" />
          <div className="h-3 w-20 bg-gray-100 rounded-full mb-2" />
          <div className="h-7 w-24 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
      <div className="h-4 w-32 bg-gray-100 rounded-full mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-10 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  // Safe fallback if useAuth() or authFetch is missing during context setup
  const authContext = useAuth();
  const authFetch = authContext?.authFetch; 
  
  // Safe default initial state avoids "Cannot read properties of null" on failed loads
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    pending: 0,
  });
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      // Guard clause in case authFetch is not provided by the AuthContext
      if (typeof authFetch !== "function") {
        console.error("authFetch is not defined in useAuth(). Check your AuthContext provider exports.");
        setError("Authentication utility missing.");
        setLoading(false);
        return;
      }

      try {
        const [pRes, oRes, uRes] = await Promise.all([
          authFetch("/api/products/v1/"),
          authFetch("/api/orders/v1/all"),
          authFetch("/api/users/v1/allusers"),
        ]);
        
        const [pData, oData, uData] = await Promise.all([
          pRes.json(), oRes.json(), uRes.json(),
        ]);
        
        const orders  = oData.data  || [];
        const revenue = orders
          .filter(o => o.paymentStatus === "completed")
          .reduce((s, o) => s + (o.totalAmount || 0), 0);
        const pending = orders.filter(o => o.orderStatus === "processing").length;

        setStats({
          products: pData.data?.length ?? 0,
          orders:   orders.length,
          users:    uData.data?.length ?? 0,
          revenue,
          pending,
        });
        setRecent([...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6));
      } catch (e) {
        console.error(e);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authFetch]); // Included authFetch in dependency array for good practice

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <span className="text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-xl">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </span>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error} (Verify your <code>AuthContext</code> contains <code>authFetch</code>)
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Revenue" value={`₹${(stats?.revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              sub="From completed orders"
              accent="bg-indigo-100"
              icon={<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard label="Total Orders" value={stats?.orders || 0}
              sub={`${stats?.pending || 0} pending`}
              accent="bg-yellow-100"
              icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
            <StatCard label="Products" value={stats?.products || 0}
              sub="In catalog"
              accent="bg-emerald-100"
              icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>}
            />
            <StatCard label="Users" value={stats?.users || 0}
              sub="Registered accounts"
              accent="bg-pink-100"
              icon={<svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
              <Link to="/admin/orders" className="text-xs text-indigo-600 hover:underline font-medium">View all →</Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                      {["Order ID", "Customer", "Amount", "Items", "Status", "Payment", "Date"].map(h => (
                        <th key={h} className="px-5 py-3 text-left font-semibold tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recent.map(o => (
                      <tr key={o._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">#{o._id?.slice(-8).toUpperCase()}</td>
                        <td className="px-5 py-3 font-medium text-gray-800">{o.user?.username || o.user?.email || "—"}</td>
                        <td className="px-5 py-3 font-bold text-gray-900">₹{o.totalAmount?.toFixed(2)}</td>
                        <td className="px-5 py-3 text-gray-500">{o.items?.length} item{o.items?.length !== 1 ? "s" : ""}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[o.orderStatus] || "bg-gray-100 text-gray-500"}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PAY_COLOR[o.paymentStatus] || "bg-gray-100 text-gray-500"}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;