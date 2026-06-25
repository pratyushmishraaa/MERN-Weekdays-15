import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

// ─── Constants ────────────────────────────────────────────────────────────────
const ORDER_STATUS = {
  processing: { label: "Processing",  bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  shipped:    { label: "Shipped",     bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  delivered:  { label: "Delivered",   bg: "bg-emerald-100",text: "text-emerald-700",border: "border-emerald-200",dot: "bg-emerald-500" },
  cancelled:  { label: "Cancelled",   bg: "bg-red-100",    text: "text-red-600",    border: "border-red-200",    dot: "bg-red-500"    },
};

const PAYMENT_STATUS = {
  pending:   { label: "Pending",   bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
  completed: { label: "Paid",      bg: "bg-emerald-100",text: "text-emerald-700",border: "border-emerald-200"},
  failed:    { label: "Failed",    bg: "bg-red-100",    text: "text-red-600",    border: "border-red-200"    },
};

// Timeline steps per order status
const TIMELINE = ["processing", "shipped", "delivered"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const StatusBadge = ({ status, map }) => {
  const s = map[status] || { label: status, bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      {map === ORDER_STATUS && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      {s.label}
    </span>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center h-48">
    <div className="w-9 h-9 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─── Order timeline component ─────────────────────────────────────────────────
const OrderTimeline = ({ orderStatus, paymentStatus }) => {
  const isCancelled = orderStatus === "cancelled";
  const currentIdx  = TIMELINE.indexOf(orderStatus);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
        <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-sm font-semibold text-red-600">This order has been cancelled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0">
      {TIMELINE.map((step, i) => {
        const done    = i < currentIdx;
        const current = i === currentIdx;
        const labels  = { processing: "Order Placed", shipped: "Shipped", delivered: "Delivered" };
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${done    ? "bg-indigo-600 border-indigo-600"
                : current ? "bg-white dark:bg-gray-900 border-indigo-600 shadow shadow-indigo-200"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"}`}>
                {done ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`w-2.5 h-2.5 rounded-full ${current ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"}`} />
                )}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${done || current ? "text-indigo-600" : "text-gray-400"}`}>
                {labels[step]}
              </span>
            </div>
            {i < TIMELINE.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${done ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Single order card ────────────────────────────────────────────────────────
const OrderCard = ({ order, onExpand, expanded, onCancel, cancelling }) => {
  const isOpen = expanded === order._id;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-200 overflow-hidden
      ${isOpen ? "border-indigo-200 dark:border-indigo-800 shadow-md shadow-indigo-50" : "border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700"}`}>

      {/* Header — always visible */}
      <button
        onClick={() => onExpand(order._id)}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        {/* Order icon */}
        <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Order #{order._id.slice(-8).toUpperCase()}</p>
            <StatusBadge status={order.orderStatus}  map={ORDER_STATUS}   />
            <StatusBadge status={order.paymentStatus} map={PAYMENT_STATUS} />
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="text-gray-200 dark:text-gray-700">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Amount + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-base font-extrabold text-gray-900 dark:text-gray-100">₹{order.totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-5 flex flex-col gap-5">

          {/* Timeline */}
          <OrderTimeline orderStatus={order.orderStatus} paymentStatus={order.paymentStatus} />

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Items Ordered</p>
            <div className="flex flex-col gap-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-indigo-600">{item.quantity}×</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">₹{item.price?.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 rounded-xl px-4 py-3 flex flex-col gap-1.5">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>₹{order.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Tax</span>
              <span>Included</span>
            </div>
            <div className="border-t border-indigo-200 dark:border-indigo-800 pt-2 mt-1 flex justify-between font-bold text-gray-900 dark:text-gray-100">
              <span>Total Paid</span>
              <span className="text-indigo-600">₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          {/* Two-column: Shipping + Payment info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shipping address */}
            {order.shippingAddress && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-1">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Shipping Address</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{order.shippingAddress.fullName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.shippingAddress.address}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""} – {order.shippingAddress.zip}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.shippingAddress.country}</p>
                {order.shippingAddress.email && (
                  <p className="text-xs text-gray-400 mt-1 pt-1 border-t border-gray-100 dark:border-gray-700">{order.shippingAddress.email}</p>
                )}
              </div>
            )}

            {/* Payment info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Payment Info</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <StatusBadge status={order.paymentStatus} map={PAYMENT_STATUS} />
              </div>
              {order.razorpayOrderId && (
                <div className="flex justify-between text-xs gap-2">
                  <span className="text-gray-500 dark:text-gray-400 shrink-0">Razorpay Order</span>
                  <span className="font-mono text-gray-600 dark:text-gray-400 text-right break-all">{order.razorpayOrderId}</span>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div className="flex justify-between text-xs gap-2">
                  <span className="text-gray-500 dark:text-gray-400 shrink-0">Payment ID</span>
                  <span className="font-mono text-gray-600 dark:text-gray-400 text-right break-all">{order.razorpayPaymentId}</span>
                </div>
              )}
              {!order.razorpayPaymentId && (
                <p className="text-xs text-orange-500 font-medium mt-1">Payment not yet confirmed</p>
              )}
            </div>
          </div>

          {/* Cancel button — processing or shipped orders only */}
          {(order.orderStatus === "processing" || order.orderStatus === "shipped") && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Cancel this order?</p>
                <p className="text-xs text-orange-600 dark:text-orange-500 mt-0.5">
                  You can cancel orders until they are delivered.
                </p>
              </div>
              <button
                onClick={() => onCancel(order._id)}
                disabled={cancelling === order._id}
                className="shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                {cancelling === order._id
                  ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Cancelling…</>
                  : "Cancel Order"}
              </button>
            </div>
          )}

          {/* Placed at */}
          <p className="text-xs text-gray-400 text-center">
            Order placed on {new Date(order.createdAt).toLocaleString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Main Orders Page ─────────────────────────────────────────────────────────
const Orders = () => {
  const { authFetch } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState("all");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res  = await authFetch("/api/orders/v1/my-orders");
        const raw  = await res.text();
        const data = JSON.parse(raw);
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
        // Sort newest first
        const sorted = (data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleExpand = (id) => setExpanded(prev => prev === id ? null : id);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(orderId);
    try {
      const res  = await authFetch(`/api/orders/v1/cancel/${orderId}`, { method: "PUT" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cancellation failed");
      // Update order status to cancelled in the list
      setOrders(prev => prev.map(o => o._id === orderId ? data.data : o));
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.orderStatus === filter);

  // Summary counts
  const counts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});
  const totalSpend = orders
    .filter(o => o.paymentStatus === "completed")
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">My Orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">Track and manage all your purchases</p>
          </div>
          <Link to="/"
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop More
          </Link>
        </div>

        {loading && <Spinner />}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-950 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No orders yet</p>
              <p className="text-sm text-gray-400 mt-1">Your completed orders will appear here.</p>
            </div>
            <Link to="/"
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-2.5 rounded-xl transition-colors">
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Orders",   value: orders.length,                         color: "border-indigo-400 bg-indigo-50 dark:bg-indigo-950",  text: "text-indigo-700" },
                { label: "Total Spent",    value: `₹${totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, color: "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700" },
                { label: "Processing",     value: counts.processing || 0,                color: "border-yellow-400 bg-yellow-50",  text: "text-yellow-700" },
                { label: "Delivered",      value: counts.delivered  || 0,                color: "border-green-400 bg-green-50",    text: "text-green-700"  },
              ].map(({ label, value, color, text }) => (
                <div key={label} className={`bg-white dark:bg-gray-900 rounded-2xl border-l-4 px-4 py-3 shadow-sm ${color}`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                  <p className={`text-xl font-extrabold mt-0.5 ${text}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
              {["all", "processing", "shipped", "delivered", "cancelled"].map((f) => {
                const count = f === "all" ? orders.length : (counts[f] || 0);
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all
                      ${filter === f
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:text-indigo-600"}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                      ${filter === f ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-950 text-gray-500 dark:text-gray-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Orders list */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm font-medium">No {filter} orders.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    expanded={expanded}
                    onExpand={handleExpand}
                    onCancel={handleCancel}
                    cancelling={cancelling}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
