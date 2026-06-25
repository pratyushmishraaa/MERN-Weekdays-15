import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Field = ({ label, name, type = "text", placeholder, autoComplete, value, onChange, error }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input id={name} name={name} type={type} autoComplete={autoComplete} value={value} onChange={onChange} placeholder={placeholder}
      className={`border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition
        dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
        ${error ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700 bg-white"}`} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Signup = () => {
  const { register, login, isLoggedIn, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-950"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (isLoggedIn) { navigate(isAdmin ? "/admin" : "/", { replace: true }); return null; }

  const handleChange = (e) => { setAlreadyExists(false); setServerError(""); setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleAvatarChange = (e) => { const f = e.target.files[0]; if (!f) return; setAvatar(f); setAvatarPreview(URL.createObjectURL(f)); };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "At least 3 characters";
    else if (form.username.length > 20) e.username = "Max 20 characters";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ username: form.username.trim(), email: form.email.trim(), password: form.password, role: form.role, avatar });
      const user = await login({ email: form.email.trim(), password: form.password });
      navigate(user?.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("already registered")) {
        setServerError("An account with this email or username already exists."); setAlreadyExists(true);
      } else { setServerError(msg); }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-indigo-600">Shop<span className="text-gray-800 dark:text-white">X</span></Link>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create your account — it's free</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md dark:shadow-none dark:border dark:border-gray-800 p-8 flex flex-col gap-5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Create Account</h2>

          {serverError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3 flex flex-col gap-2">
              <div className="flex items-start gap-2"><span className="mt-0.5 shrink-0">⚠</span><span>{serverError}</span></div>
              {alreadyExists && <Link to="/login" className="self-start bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">Go to Login →</Link>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 border-2 border-dashed border-indigo-300 dark:border-indigo-700 flex items-center justify-center overflow-hidden shrink-0">
                {avatarPreview ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" /> :
                  <svg className="w-7 h-7 text-indigo-300 dark:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="avatar" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 transition-colors">
                  {avatarPreview ? "Change photo" : "Upload photo"} <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <p className="text-xs text-gray-400">JPG, PNG — max 5MB</p>
              </div>
            </div>

            <Field label="Username" name="username" placeholder="johndoe" autoComplete="username" value={form.username} onChange={handleChange} error={errors.username} />

            {/* Role selector */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Register as</label>
              <div className="flex gap-3">
                {["user", "admin"].map((r) => (
                  <button key={r} type="button" onClick={() => setForm((prev) => ({ ...prev, role: r }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all
                      ${form.role === r ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-indigo-400"}`}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Email Address" name="email" type="email" placeholder="john@example.com" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
            <Field label="Password" name="password" type="password" placeholder="Min. 6 characters" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} />
            <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat your password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

            <button type="submit" disabled={loading}
              className="mt-1 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition-all text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
