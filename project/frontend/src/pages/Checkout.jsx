import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

// ─── Stepper ──────────────────────────────────────────────────────────────────
const STEPS = ["Cart Review", "Shipping", "Payment", "Confirmation"];

const Stepper = ({ current }) => (
  <div className="flex items-center justify-center mb-10 select-none">
    {STEPS.map((label, i) => (
      <div key={label} className="flex items-center">
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
              ${i < current  ? "bg-indigo-600 border-indigo-600 text-white"
              : i === current ? "bg-white dark:bg-gray-900 border-indigo-600 text-indigo-600 shadow-md shadow-indigo-100"
              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400"}`}
          >
            {i < current
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              : i + 1}
          </div>
          <span className={`text-xs font-semibold tracking-wide ${i <= current ? "text-indigo-600" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-5 transition-all duration-300 ${i < current ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"}`} />
        )}
      </div>
    ))}
  </div>
);

// ─── Reusable Field ───────────────────────────────────────────────────────────
const Field = ({ label, id, icon, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      )}
      <input
        id={id}
        className={`w-full border rounded-xl py-2.5 text-sm outline-none focus:ring-2 transition
          ${icon ? "pl-9 pr-3" : "px-3"}
          ${error
            ? "border-red-400 bg-red-50 focus:ring-red-200"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-indigo-200 focus:border-indigo-400"}`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        {error}
      </p>
    )}
  </div>
);

// ─── Order Summary Panel (shared across steps) ────────────────────────────────
const OrderSummary = ({ items, totalPrice }) => (
  <aside className="w-full lg:w-96 shrink-0">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">
          Order Summary · {items.reduce((s, i) => s + i.quantity, 0)} items
        </h3>
      </div>

      {/* Items list */}
      <div className="flex flex-col divide-y divide-gray-50 dark:divide-gray-800 max-h-72 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-5 py-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0 overflow-hidden p-1">
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-tight">{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
            </div>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100 shrink-0">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Subtotal</span><span>₹{totalPrice}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Shipping</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Free
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Tax</span><span>Included</span>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base">
          <span>Total</span><span className="text-indigo-600">₹{totalPrice}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="px-5 pb-4 flex items-center justify-center gap-4 text-gray-400">
        {[
          { icon: "🔒", label: "Secure" },
          { icon: "↩️", label: "Easy Returns" },
          { icon: "🚚", label: "Free Shipping" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className="text-base">{icon}</span>
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

// ─── Step 0: Cart Review ──────────────────────────────────────────────────────
const CartReview = ({ items, totalPrice, onNext, onDispatch }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Review Your Cart</h3>
      <button
        onClick={() => onDispatch(clearCart())}
        className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
      >
        Clear all
      </button>
    </div>

    <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 py-3">
          <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden flex items-center justify-center p-1 shrink-0">
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">₹{item.price.toFixed(2)} × {item.quantity}</p>
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 shrink-0">
            ₹{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}
    </div>

    <div className="bg-indigo-50 dark:bg-indigo-950 rounded-xl px-4 py-3 flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Amount</span>
      <span className="text-lg font-extrabold text-indigo-600">₹{totalPrice}</span>
    </div>

    <button
      onClick={onNext}
      className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
    >
      Continue to Shipping
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </button>

    <Link to="/cart" className="text-center text-sm text-indigo-600 hover:underline font-medium">
      ← Edit cart
    </Link>
  </div>
);

// ─── Step 1: Shipping ─────────────────────────────────────────────────────────
const ShippingForm = ({ data, onChange, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.fullName.trim())  e.fullName = "Full name is required";
    if (!data.email.trim())     e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "Invalid email";
    if (!data.phone.trim())     e.phone    = "Phone number is required";
    else if (!/^\+?[\d\s-]{7,15}$/.test(data.phone)) e.phone = "Invalid phone number";
    if (!data.address.trim())   e.address  = "Street address is required";
    if (!data.city.trim())      e.city     = "City is required";
    if (!data.state.trim())     e.state    = "State is required";
    if (!data.zip.trim())       e.zip      = "PIN code is required";
    if (!data.country.trim())   e.country  = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Shipping Details</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Where should we deliver your order?</p>
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name" id="fullName" placeholder="Ravi Kumar" value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)} error={errors.fullName}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          <Field label="Email" id="email" type="email" placeholder="ravi@example.com" value={data.email}
            onChange={(e) => onChange("email", e.target.value)} error={errors.email}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
        </div>
        <Field label="Phone Number" id="phone" type="tel" placeholder="+91 98765 43210" value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)} error={errors.phone}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 23 1 14.284 1 6V5z" /></svg>}
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</p>
        <Field label="Street Address" id="address" placeholder="123, MG Road, Apartment 4B" value={data.address}
          onChange={(e) => onChange("address", e.target.value)} error={errors.address}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" id="city" placeholder="Mumbai" value={data.city}
            onChange={(e) => onChange("city", e.target.value)} error={errors.city} />
          <Field label="State" id="state" placeholder="Maharashtra" value={data.state}
            onChange={(e) => onChange("state", e.target.value)} error={errors.state} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="PIN Code" id="zip" placeholder="400001" value={data.zip}
            onChange={(e) => onChange("zip", e.target.value)} error={errors.zip} />
          <Field label="Country" id="country" placeholder="India" value={data.country}
            onChange={(e) => onChange("country", e.target.value)} error={errors.country} />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack}
          className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button onClick={() => { if (validate()) onNext(); }}
          className="flex-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          Continue to Payment
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

// ─── Step 2: Payment ──────────────────────────────────────────────────────────
const PaymentStep = ({ shipping, items, totalPrice, onSuccess, onBack, onError }) => {
  const [loading, setLoading] = useState(false);
  const { authFetch } = useAuth();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePay = async () => {
    setLoading(true);

    const ok = await loadRazorpayScript();
    if (!ok) {
      onError("Razorpay SDK failed to load. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const createRes = await authFetch("/api/orders/v1/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ name: i.title, quantity: i.quantity, price: i.price })),
          totalAmount: parseFloat(totalPrice),
          shippingAddress: {
            fullName: shipping.fullName,
            email: shipping.email,
            address: shipping.address,
            city: shipping.city,
            zip: shipping.zip,
            country: shipping.country,
          },
        }),
      });

      const rawText = await createRes.text();
      if (!rawText) throw new Error(`Empty response (status ${createRes.status}). Are you logged in?`);
      const createData = JSON.parse(rawText);
      if (!createRes.ok) throw new Error(createData.message || "Order creation failed");

      const { razorpayOrderId, amount, currency, keyId } = createData.data;
      if (!keyId) throw new Error("Razorpay key missing. Check PAYMENT_API_KEY in backend .env");

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "ShopX",
        description: "Secure Order Payment",
        image: "https://i.imgur.com/n5tjHFD.png",
        order_id: razorpayOrderId,
        prefill: { name: shipping.fullName, email: shipping.email, contact: shipping.phone },
        notes: { address: `${shipping.address}, ${shipping.city}` },
        theme: { color: "#4f46e5" },
        handler: async (response) => {
          try {
            const verifyRes = await authFetch("/api/orders/v1/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const rawVerify = await verifyRes.text();
            if (!rawVerify) throw new Error("Empty response from verify endpoint");
            const verifyData = JSON.parse(rawVerify);
            if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed");
            onSuccess({ orderId: verifyData.data._id, razorpayPaymentId: response.razorpay_payment_id });
          } catch (err) {
            onError(`Verification failed: ${err.message}`);
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });

      rzp.on("payment.failed", (r) => {
        onError(`Payment failed: ${r.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      onError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Payment</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Review your delivery address and pay securely</p>
      </div>

      {/* Shipping recap */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delivering to</p>
          <button onClick={onBack} className="text-xs text-indigo-600 hover:underline font-medium">Edit</button>
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{shipping.fullName}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{shipping.address}, {shipping.city}, {shipping.state} – {shipping.zip}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{shipping.country}</p>
        <div className="flex items-center gap-3 mt-1 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">{shipping.email}</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{shipping.phone}</span>
        </div>
      </div>

      {/* Payment method badge */}
      <div className="border border-indigo-100 dark:border-indigo-900 bg-linear-to-r from-indigo-50 dark:from-indigo-950 to-white dark:to-gray-900 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm shrink-0">
          <img src="https://razorpay.com/favicon.ico" alt="Razorpay" className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Pay via Razorpay</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">UPI · Cards · Net Banking · Wallets · EMI</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <span className="text-xs text-emerald-600 font-semibold">Secure</span>
        </div>
      </div>

      {/* Amount summary */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Amount to pay</span>
        <span className="text-xl font-extrabold text-indigo-600">₹{totalPrice}</span>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onBack}
          className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button onClick={handlePay} disabled={loading}
          className="flex-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>Pay ₹{totalPrice}</>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        🔒 Your payment info is encrypted and never stored on our servers.
      </p>
    </div>
  );
};

// ─── Step 3: Confirmation ─────────────────────────────────────────────────────
const Confirmation = ({ shipping, total, orderId, razorpayPaymentId }) => (
  <div className="flex flex-col items-center text-center gap-5 py-4">
    {/* Success animation ring */}
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-30" />
    </div>

    <div>
      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Order Confirmed!</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm">
        Thank you, <span className="font-semibold text-gray-700 dark:text-gray-300">{shipping.fullName}</span>! Your order is placed.
        A confirmation email has been sent to <span className="font-semibold text-gray-700 dark:text-gray-300">{shipping.email}</span>.
      </p>
    </div>

    {/* Details card */}
    <div className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden text-left text-sm">
      <div className="px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        <span className="font-bold text-gray-800 dark:text-gray-100">Order Details</span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {[
          { label: "Order ID",    value: orderId,           mono: true },
          { label: "Payment ID",  value: razorpayPaymentId, mono: true },
          { label: "Deliver to",  value: `${shipping.address}, ${shipping.city}, ${shipping.state} – ${shipping.zip}, ${shipping.country}` },
          { label: "Total Paid",  value: `₹${total}`,       bold: true, colored: true },
        ].map(({ label, value, mono, bold, colored }) => (
          <div key={label} className="flex justify-between items-start gap-4 px-5 py-3">
            <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
            <span className={`text-right break-all
              ${mono    ? "font-mono text-xs text-gray-700 dark:text-gray-300"   : ""}
              ${bold    ? "font-bold text-gray-900 dark:text-gray-100"            : "font-medium text-gray-700 dark:text-gray-300"}
              ${colored ? "text-indigo-600"                    : ""}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* What's next */}
    <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4 text-left">
      <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">What happens next?</p>
      <ul className="flex flex-col gap-1.5">
        {["We'll process your order within 24 hours.", "You'll receive shipping details via email.", "Estimated delivery: 3–5 business days."].map((t) => (
          <li key={t} className="text-xs text-indigo-700 flex items-start gap-2">
            <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            {t}
          </li>
        ))}
      </ul>
    </div>

    <div className="flex gap-3 w-full pt-1">
      <Link to="/orders"
        className="flex-1 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 active:scale-[0.98] transition-all font-semibold py-3 rounded-xl text-center text-sm">
        My Orders
      </Link>
      <Link to="/"
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-xl text-center text-sm">
        Continue Shopping
      </Link>
    </div>
  </div>
);

// ─── Main Checkout ────────────────────────────────────────────────────────────
const Checkout = () => {
  const dispatch  = useDispatch();
  const { user }  = useAuth();
  const items     = useSelector((state) => state.cart.items);

  const [step, setStep]               = useState(0);
  const [paymentError, setPaymentError] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  const totalPrice = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const [shipping, setShipping] = useState({
    fullName: user?.username || "",
    email:    user?.email    || "",
    phone:    "",
    address:  "",
    city:     "",
    state:    "",
    zip:      "",
    country:  "India",
  });

  const handleShippingChange = (field, value) =>
    setShipping((prev) => ({ ...prev, [field]: value }));

  const handlePaymentSuccess = ({ orderId, razorpayPaymentId }) => {
    dispatch(clearCart());
    setOrderResult({ orderId, razorpayPaymentId });
    setStep(3);
  };

  // Empty cart guard (only before order is placed)
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-5 text-gray-400 px-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-1">Add some products before checking out.</p>
          </div>
          <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-2.5 rounded-xl transition-colors">
            Browse Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Page title */}
        <div className="mb-2">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Checkout</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Complete your purchase securely</p>
        </div>

        <Stepper current={step} />

        {/* Error banner */}
        {paymentError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span>{paymentError}</span>
            </div>
            <button onClick={() => setPaymentError(null)} className="text-red-400 hover:text-red-600 shrink-0 text-lg leading-none">×</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-7">
          {/* Left panel — active step */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            {step === 0 && (
              <CartReview
                items={items}
                totalPrice={totalPrice}
                onNext={() => setStep(1)}
                onDispatch={dispatch}
              />
            )}
            {step === 1 && (
              <ShippingForm
                data={shipping}
                onChange={handleShippingChange}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <PaymentStep
                shipping={shipping}
                items={items}
                totalPrice={totalPrice}
                onSuccess={handlePaymentSuccess}
                onBack={() => setStep(1)}
                onError={(msg) => setPaymentError(msg)}
              />
            )}
            {step === 3 && orderResult && (
              <Confirmation
                shipping={shipping}
                total={totalPrice}
                orderId={orderResult.orderId}
                razorpayPaymentId={orderResult.razorpayPaymentId}
              />
            )}
          </div>

          {/* Right panel — order summary (hidden on confirmation) */}
          {step < 3 && (
            <OrderSummary items={items} totalPrice={totalPrice} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

