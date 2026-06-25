import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

const ROLE_COLOR = {
  admin: "bg-red-100 text-red-600 border-red-200",
  user:  "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const Spinner = ({ sm }) => (
  <div className={`border-2 border-t-transparent rounded-full animate-spin ${sm ? "w-4 h-4 border-white" : "w-8 h-8 border-indigo-500"}`} />
);

const AdminUsers = () => {
  const { authFetch, user: me } = useAuth();
  const [users,    setUsers]    = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchUsers = async () => {
    try {
      const r = await authFetch("/api/users/v1/allusers");
      const raw = await r.text();
      const d = raw ? JSON.parse(raw) : {};
      if (!r.ok) throw new Error(d.message || "Failed to fetch users");
      const usersData = d.data || [];
      setUsers(usersData);
      setFiltered(usersData);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [authFetch]);

  useEffect(() => {
    let list = users;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== "all") list = list.filter(u => u.role === roleFilter);
    setFiltered(list);
  }, [search, roleFilter, users]);

  const handleDelete = async (userId) => {
    if (userId === me?.id) { setError("You cannot delete your own account from here."); return; }
    if (!window.confirm("Permanently delete this user and all their data?")) return;
    setDeleting(userId);
    try {
      const res = await authFetch(`/api/users/v1/deleteprofile`, { method: "DELETE" });
      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!res.ok) throw new Error(data.message || "Delete failed");
      setUsers(prev => prev.filter(u => u._id !== userId));
      if (selected?._id === userId) setSelected(null);
    } catch (e) { setError(e.message); }
    finally { setDeleting(null); }
  };

  const admins = users.filter(u => u.role === "admin").length;
  const regular = users.filter(u => u.role === "user").length;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Users</h2>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} total · {admins} admin{admins !== 1 ? "s" : ""} · {regular} user{regular !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 gap-2 w-52">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search users…" className="text-sm bg-transparent outline-none w-full text-gray-700 placeholder-gray-400" />
          </div>
          {/* Role filter */}
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users",  value: users.length,  color: "border-indigo-400 bg-indigo-50", textColor: "text-indigo-700" },
          { label: "Admins",       value: admins,         color: "border-red-400 bg-red-50",       textColor: "text-red-600"    },
          { label: "Regular Users",value: regular,        color: "border-emerald-400 bg-emerald-50",textColor: "text-emerald-700"},
        ].map(({ label, value, color, textColor }) => (
          <div key={label} className={`rounded-2xl border-l-4 p-4 ${color} bg-white shadow-sm`}>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${textColor}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <p className="text-sm font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                  {["User", "Email", "Role", "Joined", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-semibold tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {u.avatar
                          ? <img src={u.avatar} alt={u.username} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-gray-100" />
                          : <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold uppercase shrink-0">{u.username?.[0]}</div>
                        }
                        <div>
                          <p className="font-semibold text-gray-900">{u.username}</p>
                          {u._id === me?.id && <span className="text-xs text-indigo-500 font-medium">(You)</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 truncate max-w-[180px]">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ROLE_COLOR[u.role] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(u)}
                        className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto flex flex-col shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">User Profile</h3>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 px-6 py-6 flex flex-col gap-5">
              {/* Avatar + name */}
              <div className="flex flex-col items-center gap-3">
                {selected.avatar
                  ? <img src={selected.avatar} alt={selected.username} className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100 shadow-sm" />
                  : <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold uppercase shadow-sm">{selected.username?.[0]}</div>
                }
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{selected.username}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ROLE_COLOR[selected.role]}`}>{selected.role}</span>
                </div>
              </div>

              {/* Details */}
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
                {[
                  { label: "Email",    value: selected.email },
                  { label: "User ID",  value: selected._id, mono: true },
                  { label: "Joined",   value: new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Updated",  value: new Date(selected.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex justify-between items-start gap-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">{label}</span>
                    <span className={`text-right text-sm break-all ${mono ? "font-mono text-xs text-gray-600" : "font-medium text-gray-900"}`}>{value}</span>
                  </div>
                ))}
              </div>

              {selected._id !== me?.id && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Danger Zone</p>
                  <p className="text-xs text-gray-500 mb-3">Deleting this user will permanently remove their account. This cannot be undone.</p>
                  <button onClick={() => handleDelete(selected._id)} disabled={deleting === selected._id}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    {deleting === selected._id ? <><Spinner sm />Deleting…</> : "Delete User"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
