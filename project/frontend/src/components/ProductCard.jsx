import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, increaseQuantity, decreaseQuantity } from "../store/cartSlice";

const ProductCard = ({ product }) => {
  const { _id, name, image, price, category, stock = 0 } = product;
  const dispatch = useDispatch();
  const cartItem = useSelector((s) => s.cart.items.find((i) => i.id === _id));

  const isOutOfStock = stock === 0;
  const isLowStock   = stock > 0 && stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(addToCart({ id: _id, title: name, thumbnail: image, price: parseFloat(price) }));
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-50 dark:hover:shadow-none transition-all duration-300 flex flex-col">

      {/* ── Image ── */}
      <Link to={`/product/${_id}`} className="relative block overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-square">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
          onError={(e) => { e.target.src = "https://placehold.co/300x300?text=No+Image"; }}
        />

        {/* Category pill */}
        <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
          {category}
        </span>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px]">
            <span className="bg-gray-800 dark:bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {/* Low stock badge */}
        {isLowStock && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
            Only {stock} left
          </span>
        )}
      </Link>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4">

        {/* Name */}
        <Link to={`/product/${_id}`}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">
            ₹{Number(price).toLocaleString("en-IN")}
          </span>
          {!isOutOfStock && stock > 5 && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              In Stock
            </span>
          )}
        </div>

        {/* Cart control — pushed to bottom */}
        <div className="mt-4">
          {cartItem ? (
            <div className="flex items-center justify-between border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 rounded-xl overflow-hidden">
              <button
                onClick={() => dispatch(decreaseQuantity(_id))}
                className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 active:scale-95 transition-all text-xl font-bold"
                aria-label="Decrease">−</button>
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{cartItem.quantity}</span>
              <button
                onClick={() => dispatch(increaseQuantity(_id))}
                className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 active:scale-95 transition-all text-xl font-bold"
                aria-label="Increase">+</button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              {isOutOfStock ? "Unavailable" : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
