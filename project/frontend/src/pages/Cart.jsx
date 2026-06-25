import { useDispatch, useSelector } from "react-redux";
import { increaseQuantity, decreaseQuantity, clearCart } from "../store/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector((state) => state.cart.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Your Cart <span className="text-base font-normal text-gray-400">({totalItems} {totalItems === 1 ? "item" : "items"})</span>
          </h2>
          {items.length > 0 && (
            <button onClick={() => dispatch(clearCart())}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <p className="text-lg font-medium dark:text-gray-500">Your cart is empty</p>
            <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 p-4">
                <img src={item.thumbnail} alt={item.title}
                  className="w-20 h-20 object-contain rounded-xl bg-gray-50 dark:bg-gray-800 p-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">{item.title}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold text-lg">−</button>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 w-6 text-center">{item.quantity}</span>
                  <button onClick={() => dispatch(increaseQuantity(item.id))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold text-lg">+</button>
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 w-20 text-right shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 mt-2">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Subtotal ({totalItems} items)</span><span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-800 dark:text-gray-100">
                <span>Total</span><span>₹{totalPrice}</span>
              </div>
              <button onClick={() => navigate("/checkout")}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-semibold py-3 rounded-xl">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
