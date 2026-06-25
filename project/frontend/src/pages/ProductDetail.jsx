import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQuantity, decreaseQuantity } from "../store/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

const STOCK_LABEL = (s) => s > 10 ? "In Stock" : s > 0 ? `Only ${s} left` : "Out of Stock";
const STOCK_COLOR = (s) => s > 10 ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700"
  : s > 0  ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
  : "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";

const ProductDetail = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [imgError, setImgError] = useState(false);

  const cartItem = useSelector((s) => s.cart.items.find((i) => i.id === id));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/v1/${id}`);
        setProduct(data.data);
      } catch (e) {
        setError(e.response?.data?.message || e.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </main>
      <Footer />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">{error || "Product not found"}</p>
        <button onClick={() => navigate("/")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
          ← Back to Store
        </button>
      </main>
      <Footer />
    </div>
  );

  const { _id, name, description, price, category, stock = 0, image } = product;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Store</Link>
          <span>›</span>
          <span className="text-gray-500 dark:text-gray-400 capitalize">{category}</span>
          <span>›</span>
          <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-xs">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: Image ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden flex items-center justify-center p-8 aspect-square shadow-sm">
              <img
                src={imgError ? "https://placehold.co/400x400?text=No+Image" : image}
                alt={name}
                onError={() => setImgError(true)}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Stock overlay for out of stock */}
            {stock === 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-sm text-red-600 font-semibold text-center">
                This product is currently out of stock
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-5">

            {/* Category badge */}
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{category}</span>

            {/* Name */}
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">{name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                ₹{Number(price).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Stock badge */}
            <span className={`w-fit text-xs font-bold px-3 py-1.5 rounded-full border ${STOCK_COLOR(stock)}`}>
              {STOCK_LABEL(stock)}
            </span>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description || "No description available for this product."}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-800" />

            {/* Product meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Category",    value: category },
                { label: "Stock",       value: stock > 0 ? `${stock} units` : "Out of stock" },
                { label: "Product ID",  value: _id.slice(-8).toUpperCase(), mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                  <p className={`text-sm font-semibold text-gray-800 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Cart controls */}
            <div className="flex flex-col gap-3 pt-2">
              {cartItem ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950 rounded-2xl px-3 py-2">
                    <button onClick={() => dispatch(decreaseQuantity(_id))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold text-xl"
                      aria-label="Decrease">−</button>
                    <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300 min-w-[32px] text-center">
                      {cartItem.quantity}
                    </span>
                    <button onClick={() => dispatch(increaseQuantity(_id))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold text-xl"
                      aria-label="Increase">+</button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ₹{(price * cartItem.quantity).toLocaleString("en-IN")} total
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => stock > 0 && dispatch(addToCart({ id: _id, title: name, thumbnail: image, price: parseFloat(price) }))}
                  disabled={stock === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-bold py-4 rounded-2xl text-base flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  {stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              )}

              <Link to="/cart"
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-2xl text-center text-sm">
                View Cart
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-2 border-t border-gray-100 dark:border-gray-800">
              {[{ icon: "🔒", text: "Secure Payment" }, { icon: "🚚", text: "Free Delivery" }, { icon: "↩️", text: "Easy Returns" }].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
