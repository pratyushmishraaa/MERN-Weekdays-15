import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

const Profile = () => {
  const { user, logout, updateUserInContext, loading: authLoading, authFetch } = useAuth();
  const navigate = useNavigate();
  const fileRef  = useRef();

  const [username,        setUsername]        = useState(user?.username || "");
  const [avatarFile,      setAvatarFile]      = useState(null);
  const [avatarPreview,   setAvatarPreview]   = useState(null);
  const [saving,          setSaving]          = useState(false);
  const [success,         setSuccess]         = useState("");
  const [error,           setError]           = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting,        setDeleting]        = useState(false);

  // Password change state
  const [pwForm,    setPwForm]    = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError,   setPwError]   = useState("");
  const [pwErrors,  setPwErrors]  = useState({});

  if (authLoading) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!username.trim()) { setError("Username cannot be empty"); return; }
    if (username.trim().length < 3)  { setError("Username must be at least 3 characters"); return; }
    if (username.trim().length > 20) { setError("Username must be at most 20 characters"); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("username", username.trim());
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await authFetch("/api/users/v1/updateprofile", {
        method: "PUT",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile update failed");

      updateUserInContext({
        username: data.data.username,
        avatar:   data.data.avatar,
      });

      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete("/api/users/v1/deleteprofile");
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setDeleting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(""); setPwSuccess(""); setPwErrors({});
    const e2 = {};
    if (!pwForm.current)           e2.current  = "Current password is required";
    if (!pwForm.newPw)             e2.newPw    = "New password is required";
    else if (pwForm.newPw.length < 6) e2.newPw = "At least 6 characters";
    if (!pwForm.confirm)           e2.confirm  = "Please confirm new password";
    else if (pwForm.newPw !== pwForm.confirm) e2.confirm = "Passwords do not match";
    if (Object.keys(e2).length) { setPwErrors(e2); return; }
    setPwSaving(true);
    try {
      await api.put("/api/users/v1/changepassword", {
        currentPassword: pwForm.current,
        newPassword: pwForm.newPw,
      });
      setPwSuccess("Password changed successfully!");
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err) {
      setPwError(err.response?.data?.message || err.message);
    } finally {
      setPwSaving(false);
    }
  };

  // Current avatar to display — preview takes priority, then saved avatar, then initial
  const displayAvatar = avatarPreview || user?.avatar || null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">

        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your account details and avatar</p>
        </div>

        {/* ── Profile card ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-5">

          {/* Avatar section */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            {/* Avatar with edit overlay */}
            <div className="relative shrink-0 group cursor-pointer" onClick={() => fileRef.current?.click()}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 bg-indigo-50 dark:bg-indigo-950 shadow-sm">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-indigo-600 uppercase">
                    {user?.username?.[0]}
                  </div>
                )}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {/* New badge when preview is set */}
              {avatarPreview && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{user?.username}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mt-1.5 border
                ${user?.role === "admin"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-700"
                  : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 border-emerald-200 dark:border-emerald-700"}`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Alerts */}
          {success && (
            <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">

            {/* Avatar upload button */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Picture</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 bg-white dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 px-4 py-2 rounded-xl transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {avatarPreview ? "Change photo" : "Upload new photo"}
                </button>
                {avatarPreview && (
                  <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                    Remove
                  </button>
                )}
                <span className="text-xs text-gray-400">JPG, PNG — max 5MB</span>
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Username</label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={e => { setUsername(e.target.value); setSuccess(""); setError(""); }}
                placeholder="Your username"
                className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800"
              />
              <p className="text-xs text-gray-400">3–20 characters</p>
            </div>

            {/* Email (read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                value={user?.email}
                disabled
                className="border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 text-gray-400 rounded-xl px-3 py-2.5 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-gray-400">Email address cannot be changed</p>
            </div>

            <button type="submit" disabled={saving}
              className="mt-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Change Password ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Change Password</h3>
          </div>

          {pwSuccess && (
            <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {pwSuccess}
            </div>
          )}
          {pwError && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {pwError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            {[
              { id: "current", label: "Current Password", key: "current", placeholder: "Your current password" },
              { id: "newPw",   label: "New Password",     key: "newPw",   placeholder: "Min. 6 characters" },
              { id: "confirm", label: "Confirm New Password", key: "confirm", placeholder: "Repeat new password" },
            ].map(({ id, label, key, placeholder }) => (
              <div key={id} className="flex flex-col gap-1.5">
                <label htmlFor={id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                <input id={id} type="password" value={pwForm[key]}
                  onChange={e => { setPwForm(p => ({ ...p, [key]: e.target.value })); setPwSuccess(""); setPwError(""); }}
                  placeholder={placeholder}
                  className={`border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 transition
                    dark:bg-gray-800 dark:text-gray-100
                    ${pwErrors[key] ? "border-red-400 focus:ring-red-200" : "border-gray-200 dark:border-gray-700 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800"}`}
                />
                {pwErrors[key] && <p className="text-xs text-red-500">{pwErrors[key]}</p>}
              </div>
            ))}
            <button type="submit" disabled={pwSaving}
              className="mt-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
              {pwSaving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating…</>
                : "Update Password"}
            </button>
          </form>
        </div>

        {/* ── Danger zone ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/50 shadow-sm p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-600">Danger Zone</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Deleting your account is permanent and cannot be undone. All your orders and data will be removed.</p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="text-sm font-semibold text-red-500 border border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors">
              Delete My Account
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-sm font-semibold text-red-700">Are you absolutely sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                  {deleting ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting…</> : "Yes, delete permanently"}
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
