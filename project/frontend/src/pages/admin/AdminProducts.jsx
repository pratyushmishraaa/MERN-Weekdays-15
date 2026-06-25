import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

const EMPTY = { name: "", description: "", price: "", category: "", stock: "" };

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 flex items-center gap-1">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
      {error}
    </p>}
  </div>
);

const inputCls = "border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition w-full bg-gray-50 focus:bg-white";

const Spinner = ({ sm }) => (
  <div className={`border-2 border-white border-t-transparent rounded-full animate-spin ${sm ? "w-4 h-4" : "w-8 h-8 border-indigo-500 border-t-transparent"}`} />
);

const STATUS_BADGE = (stock) =>
  stock > 10 ? "bg-emerald-100 text-emerald-700" :
  stock > 0  ? "bg-yellow-100 text-yellow-700"   : "bg-red-100 text-red-600";

const AdminProducts = () => {
  const { authFetch } = useAuth();
  const [products,   setProducts]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [imageFile,  setImageFile]  = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(null);
  const [formError,  setFormError]  = useState("");
  const fileRef = useRef();

  const fetchProducts = async () => {
    try {
      const r = await authFetch("/api/products/v1/");
      const raw = await r.text();
      const d = raw ? JSON.parse(raw) : {};
      if (!r.ok) throw new Error(d.message || "Failed to fetch products");
      const items = d.data || [];
      setProducts(items);
      setFiltered(items);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [authFetch]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ));
  }, [search, products]);

  const openCreate = () => {
    setForm(EMPTY); setEditId(null); setImageFile(null);
    setImgPreview(null); setFormError(""); setShowModal(true);
  };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock });
    setEditId(p._id); setImageFile(null); setImgPreview(p.image || null);
    setFormError(""); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())        return "Product name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) return "Valid price is required.";
    if (!form.category.trim())    return "Category is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setSaving(true); setFormError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const url    = editId ? `/api/products/v1/${editId}` : "/api/products/v1/";
      const method = editId ? "PUT" : "POST";
      const res    = await authFetch(url, { method, body: fd });
      const raw    = await res.text();
      const data   = raw ? JSON.parse(raw) : {};
      if (!res.ok) throw new Error(data.message || "Save failed");
      closeModal();
      fetchProducts();
    } catch (err) { setFormError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this product?")) return;
    setDeleting(id);
    try {
      const res = await authFetch(`/api/products/v1/${id}`, { method: "DELETE" });
      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!res.ok) throw new Error(data.message || "Delete failed");
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err.message);
    } finally { setDeleting(null); }
  };

  return (
    <AdminLayout>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} of {products.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 gap-2 w-56">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products…" className="text-sm bg-transparent outline-none w-full text-gray-700 placeholder-gray-400" />
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" /></svg>
            <p className="text-sm font-medium">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                  {["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-semibold tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-1">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-900 max-w-[180px] truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate">{p.description}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">₹{Number(p.price).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">{p.stock}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE(p.stock)}`}>
                        {p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                          {deleting === p._id
                            ? <Spinner sm />
                            : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{editId ? "Edit Product" : "Add New Product"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{editId ? "Update product details" : "Fill in the details below"}</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {formError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {formError}
                </div>
              )}
              <form id="product-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Image upload */}
                <Field label="Product Image">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-indigo-400 transition-colors" onClick={() => fileRef.current?.click()}>
                      {imgPreview
                        ? <img src={imgPreview} alt="preview" className="w-full h-full object-contain p-1" />
                        : <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    </div>
                    <div>
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                        {imgPreview ? "Change image" : "Upload image"}
                      </button>
                      <p className="text-xs text-gray-400 mt-0.5">PNG, JPG — max 5MB (optional)</p>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                  </div>
                </Field>

                <Field label="Product Name">
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. iPhone 15 Pro" className={inputCls} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category">
                    <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. smartphones" className={inputCls} />
                  </Field>
                  <Field label="Price (₹)">
                    <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="999" className={inputCls} />
                  </Field>
                </div>

                <Field label="Stock Quantity">
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="50" className={inputCls} />
                </Field>

                <Field label="Description">
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                    placeholder="Describe the product…" className={`${inputCls} resize-none`} />
                </Field>
              </form>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button type="button" onClick={closeModal}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                Cancel
              </button>
              <button type="submit" form="product-form" disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                {saving ? <><Spinner sm />{editId ? "Updating…" : "Creating…"}</> : (editId ? "Update Product" : "Create Product")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
