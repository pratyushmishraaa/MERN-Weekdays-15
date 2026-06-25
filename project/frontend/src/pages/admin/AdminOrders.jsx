import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

const ORDER_STATUSES   = ["processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "completed", "failed"];

const ORDER_COLOR = {
  processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
  shipped:    "bg-blue-100 text-blue-700 border-blue-200",
  delivered:  "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled:  "bg-red-100 text-red-600 border-red-200",
};
const PAY_COLOR = {
  pending:   "bg-orange-100 text-orange-600 border-orange-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed:    "bg-red-100 text-red-600 border-red-200",
};

const Spinner = ({ sm }) => (
  <div className={`border-2 border-t-transparent rounded-full animate-spin ${sm ? "w-4 h-4 border-white" : "w-8 h-8 border-indigo-500"}`} />
);

const AdminOrders = () => {
  const { authFetch } = useAuth();
  const [orders,    setOrders]    = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [updating,  setUpdating]  = useState(null);
  const [deleting,  setDeleting]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPay,    setFilterPay]    = useState("all");
  const [selected,  setSelected]  = useState(null); // order detail drawer

  const fetchOrders = async () => {
    try {
      const r = await authFetch("/api/orders/v1/all");
      const d = await r.json();
      const data = d.data || [];
      setOrders(data);
      setFiltered(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let list = orders;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o._id.toLowerCase().includes(q) ||
        o.user?.username?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "all") list = list.filter(o => o.orderStatus  === filterStatus);
    if (filterPay    !== "all") list = list.filter(o => o.paymentStatus === filterPay);
    setFiltered(list);
  }, [search, filterStatus, filterPay, orders]);

  const handleUpdate = async (orderId, field, value) => {
    setUpdating(orderId + field);
    try {
      const res  = await authFetch(`/api/orders/v1/status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(prev => prev.map(o => o._id === orderId ? data.data : o));
      if (selected?._id === orderId) setSelected(data.data);
    } catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Permanently delete this order?")) return;
    setDeleting(orderId);
    try {
      await authFetch(`/api/orders/v1/delete/${orderId}`, { method: "DELETE" });
      setOrders(prev => prev.filter(o => o._id !== orderId));
      if (selected?._id === orderId) setSelected(null);
    } finally { setDeleting(null); }
  };

  const revenue = orders
    .filter(o => o.paymentStatus === "completed")
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} orders · ₹{revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })} revenue</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 gap-2 w-52">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search orders…" className="text-sm bg-transparent outline-none w-full text-gray-700 placeholder-gray-400" />
          </div>
          {/* Status filter */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {/* Payment filter */}
          <select value={filterPay} onChange={e => setFilterPay(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="all">All Payments</option>
            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
            <p className="text-sm font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                  {["Order", "Customer", "Amount", "Items", "Order Status", "Payment", "Date", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-semibold tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(o)}
                        className="font-mono text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">
                        #{o._id.slice(-8).toUpperCase()}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900 truncate max-w-[120px]">{o.user?.username || "—"}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[120px]">{o.user?.email}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900 whitespace-nowrap">₹{o.totalAmount?.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-gray-500">{o.items?.length}</td>
                    <td className="px-5 py-3.5">
                      <select value={o.orderStatus}
                        disabled={updating === o._id + "orderStatus"}
                        onChange={e => handleUpdate(o._id, "orderStatus", e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer ${ORDER_COLOR[o.orderStatus] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <select value={o.paymentStatus}
                        disabled={updating === o._id + "paymentStatus"}
                        onChange={e => handleUpdate(o._id, "paymentStatus", e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer ${PAY_COLOR[o.paymentStatus] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(o)}
                          className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors">
                          View
                        </button>
                        <button onClick={() => handleDelete(o._id)} disabled={deleting === o._id}
                          className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                          {deleting === o._id ? <Spinner sm /> : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <p className="text-xs text-gray-400 font-medium">Order Details</p>
                <h3 className="text-base font-bold text-gray-900">#{selected._id.slice(-8).toUpperCase()}</h3>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 px-6 py-5 flex flex-col gap-5">
              {/* Status badges */}
              <div className="flex gap-2">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${ORDER_COLOR[selected.orderStatus]}`}>{selected.orderStatus}</span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${PAY_COLOR[selected.paymentStatus]}`}>{selected.paymentStatus}</span>
              </div>

              {/* Customer */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer</p>
                <p className="font-semibold text-gray-900">{selected.user?.username || "—"}</p>
                <p className="text-sm text-gray-500">{selected.user?.email}</p>
              </div>

              {/* Shipping */}
              {selected.shippingAddress && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</p>
                  <p className="font-semibold text-gray-900">{selected.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600 mt-1">{selected.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">{selected.shippingAddress.city}, {selected.shippingAddress.zip}</p>
                  <p className="text-sm text-gray-600">{selected.shippingAddress.country}</p>
                  {selected.shippingAddress.email && <p className="text-xs text-gray-400 mt-1">{selected.shippingAddress.email}</p>}
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items ({selected.items?.length})</p>
                <div className="flex flex-col gap-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">₹{(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-indigo-50 rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="font-semibold text-gray-700">Total Amount</span>
                <span className="text-lg font-extrabold text-indigo-600">₹{selected.totalAmount?.toFixed(2)}</span>
              </div>

              {/* Payment IDs */}
              {selected.razorpayOrderId && (
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-1.5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Info</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Razorpay Order</span>
                    <span className="font-mono text-gray-700 text-right break-all max-w-[200px]">{selected.razorpayOrderId}</span>
                  </div>
                  {selected.razorpayPaymentId && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Payment ID</span>
                      <span className="font-mono text-gray-700 text-right break-all max-w-[200px]">{selected.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Update status inline */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Update Status</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-600">Order</label>
                    <select value={selected.orderStatus}
                      onChange={e => handleUpdate(selected._id, "orderStatus", e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50">
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-600">Payment</label>
                    <select value={selected.paymentStatus}
                      onChange={e => handleUpdate(selected._id, "paymentStatus", e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50">
                      {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Placed on {new Date(selected.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
