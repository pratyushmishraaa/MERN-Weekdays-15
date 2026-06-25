import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Products       from "./pages/Products";
import ProductDetail  from "./pages/ProductDetail";
import Cart           from "./pages/Cart";
import Checkout       from "./pages/Checkout";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import Profile        from "./pages/Profile";
import Orders         from "./pages/Orders";
import Dashboard      from "./pages/admin/Dashboard";
import AdminProducts  from "./pages/admin/AdminProducts";
import AdminOrders    from "./pages/admin/AdminOrders";
import AdminUsers     from "./pages/admin/AdminUsers";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"                         element={<Products />} />
        <Route path="/product/:id"              element={<ProductDetail />} />
        <Route path="/login"                    element={<Login />} />
        <Route path="/signup"                   element={<Signup />} />
        <Route path="/forgot-password"          element={<ForgotPassword />} />
        <Route path="/reset-password/:token"    element={<ResetPassword />} />

        {/* Protected — login required */}
        <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* Admin — login + admin role required */}
        <Route path="/admin"          element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users"    element={<AdminRoute><AdminUsers /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
