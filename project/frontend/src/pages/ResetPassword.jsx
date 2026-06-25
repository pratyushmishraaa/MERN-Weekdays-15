import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const ResetPassword = () => {
  const { token }   = useParams();
  const navigate    = useNavigate();
  const [form,      setForm]     = useState({ password: "", confirm: "" });
  const [loading,   setLoading]  = useState(false);
  const [success,   setSuccess]  = useState(false);
  const [error,     setError]    = useState("");
  const [errors,    setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.password)           e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (!form.confirm)            e.confirm  = "Please confirm your password";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post(`/api/auth/v1/reset-password/${token}`, { password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Reset failed");
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
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Set a new password</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md dark:border dark:border-gray-800 p-8 flex flex-col gap-5">

          {success ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Password reset!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your password has been updated. Redirecting to login…
                </p>
              </div>
              <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Set New Password</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Choose a strong password with at least 6 characters.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                  <span>⚠</span><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {[
                  { id: "password", label: "New Password",     key: "password", placeholder: "Min. 6 characters" },
                  { id: "confirm",  label: "Confirm Password", key: "confirm",  placeholder: "Repeat new password" },
                ].map(({ id, label, key, placeholder }) => (
                  <div key={id} className="flex flex-col gap-1.5">
                    <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                    <input id={id} type="password" value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className={`border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 transition
                        dark:bg-gray-800 dark:text-gray-100
                        ${errors[key] ? "border-red-400 focus:ring-red-200" : "border-gray-300 dark:border-gray-700 focus:ring-indigo-300 focus:border-indigo-400"}`}
                    />
                    {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
                  </div>
                ))}

                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 active:scale-95 transition-all text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Resetting…</> : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
