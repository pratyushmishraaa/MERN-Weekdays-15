import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const ForgotPassword = () => {
  const [email,     setEmail]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required"); return; }
    setLoading(true);
    try {
      await api.post("/api/auth/v1/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-indigo-600">
            Shop<span className="text-gray-800 dark:text-white">X</span>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Reset your password</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md dark:border dark:border-gray-800 p-8 flex flex-col gap-5">

          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Check your inbox</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  If <strong>{email}</strong> is registered, you'll receive a reset link shortly.
                </p>
              </div>
              <p className="text-xs text-gray-400">The link expires in 15 minutes.</p>
              <Link to="/login" className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Forgot Password?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                  <span>⚠</span><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    id="email" type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 active:scale-95 transition-all text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</> : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Remember your password?{" "}
                <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
