import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORIES = ['mens', 'ladies', 'smart', 'accessories'];
const SUBCATEGORIES = ['', 'metal', 'leather'];

const EMPTY_FORM = {
  name: '', category: 'mens', subcategory: '', original_price: '',
  discount_price: '', delivery_fee: '60', description: '', available: true,
  images: ['', '', ''],
};

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [carousel, setCarousel] = useState([]);
  const [carouselForm, setCarouselForm] = useState({ image_url: '', title: '', subtitle: '', sort_order: 0 });
  const [uploading, setUploading] = useState([false, false, false]);
  const [carouselUploading, setCarouselUploading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (!token) { router.push('/admin'); return; }
    fetchProducts();
    fetchCarousel();
  }, []);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Cookies.get('admin_token')}`,
  });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/products', { headers: getHeaders() });
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  const fetchCarousel = async () => {
    const res = await fetch('/api/carousel', { headers: getHeaders() });
    const data = await res.json();
    setCarousel(data.slides || []);
  };

  const handleLogout = () => {
    Cookies.remove('admin_token');
    router.push('/admin');
  };

  // Image Upload via Cloudinary
  const handleImageUpload = async (file, index) => {
    if (!file) return;
    setUploading(prev => { const u = [...prev]; u[index] = true; return u; });
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json();
        if (data.url) {
          setForm(f => {
            const imgs = [...f.images];
            imgs[index] = data.url;
            return { ...f, images: imgs };
          });
          toast.success('Image uploaded!');
        }
      };
      reader.readAsDataURL(file);
    } catch { toast.error('Upload failed'); }
    setUploading(prev => { const u = [...prev]; u[index] = false; return u; });
  };

  const handleCarouselImageUpload = async (file) => {
    if (!file) return;
    setCarouselUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch('/api/admin/upload', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ image: reader.result }),
      });
      const data = await res.json();
      if (data.url) setCarouselForm(f => ({ ...f, image_url: data.url }));
      setCarouselUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const openAddForm = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      original_price: product.original_price,
      discount_price: product.discount_price,
      delivery_fee: product.delivery_fee,
      description: product.description || '',
      available: product.available,
      images: [...(product.images || ['', '', '']), '', '', ''].slice(0, 3),
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        images: form.images.filter(Boolean),
        original_price: Number(form.original_price),
        discount_price: Number(form.discount_price),
        delivery_fee: Number(form.delivery_fee),
      };
      const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products';
      const method = editProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editProduct ? 'Product updated!' : 'Product added!');
        setShowForm(false);
        fetchProducts();
      } else { toast.error('Failed to save'); }
    } catch { toast.error('Error saving product'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) { toast.success('Deleted!'); fetchProducts(); }
    else toast.error('Failed to delete');
  };

  const toggleAvailability = async (product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ ...product, available: !product.available }),
    });
    if (res.ok) { fetchProducts(); toast.success('Updated!'); }
  };

  const handleAddCarousel = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/carousel', {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify(carouselForm),
    });
    if (res.ok) {
      toast.success('Carousel slide added!');
      setCarouselForm({ image_url: '', title: '', subtitle: '', sort_order: 0 });
      fetchCarousel();
    }
  };

  const handleDeleteCarousel = async (id) => {
    if (!confirm('Delete this slide?')) return;
    await fetch(`/api/carousel/${id}`, { method: 'DELETE', headers: getHeaders() });
    fetchCarousel();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Toaster position="top-right" toastOptions={{ style: { background: '#141414', color: '#fff', border: '1px solid #1f1f1f' } }} />

      {/* Admin Navbar */}
      <nav className="bg-[#0f0f0f] border-b border-[#1f1f1f] px-4 h-14 flex items-center justify-between">
        <span className="font-serif text-lg font-bold tracking-widest">ZEIT<span className="text-emerald-500">ZONE</span> <span className="text-gray-500 text-sm font-normal">Admin</span></span>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener" className="text-gray-500 hover:text-gray-300 text-xs">View Store →</a>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-400 text-xs px-3 py-1.5 border border-red-900 rounded-lg transition">Logout</button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-4 pb-0">
        {['products', 'carousel'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium capitalize transition ${
              activeTab === tab ? 'bg-[#141414] text-white border border-b-0 border-[#1f1f1f]' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {tab === 'products' ? 'Products' : 'Hero Carousel'}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="p-4 border border-[#1f1f1f] rounded-b-xl rounded-tr-xl bg-[#141414] mx-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            <button onClick={openAddForm} className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Add Watch
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-600">Loading...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-gray-600">No products yet. Add your first watch!</div>
          ) : (
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="flex items-center gap-3 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-3">
                  {/* Image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-900">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="7" strokeWidth="1.5"/></svg>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-emerald-500 text-sm font-bold">৳{Number(product.discount_price).toLocaleString()}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${product.category === 'mens' ? 'bg-blue-900/40 text-blue-400' : product.category === 'ladies' ? 'bg-pink-900/40 text-pink-400' : 'bg-purple-900/40 text-purple-400'}`}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Toggle availability */}
                    <button
                      onClick={() => toggleAvailability(product)}
                      className={`relative inline-flex w-10 h-5 rounded-full transition-colors flex-shrink-0 ${product.available ? 'bg-emerald-600' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block mt-0.5 ml-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${product.available ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <button onClick={() => openEditForm(product)} className="p-1.5 hover:bg-[#2a2a2a] rounded-lg text-gray-400 hover:text-white transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:bg-red-900/30 rounded-lg text-red-600 hover:text-red-400 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Carousel Tab */}
      {activeTab === 'carousel' && (
        <div className="p-4 border border-[#1f1f1f] rounded-b-xl rounded-tr-xl bg-[#141414]">
          <form onSubmit={handleAddCarousel} className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4 mb-4 space-y-3">
            <p className="text-white font-medium text-sm">Add Carousel Slide</p>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Image (400×125px recommended)</label>
              <input type="file" accept="image/*" onChange={e => handleCarouselImageUpload(e.target.files[0])}
                className="block w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-900/40 file:text-emerald-400 file:text-xs" />
              {carouselUploading && <p className="text-emerald-400 text-xs mt-1">Uploading...</p>}
              {carouselForm.image_url && <img src={carouselForm.image_url} alt="" className="mt-2 h-16 rounded-lg object-cover" />}
            </div>
            <input type="text" placeholder="Title (optional)" value={carouselForm.title} onChange={e => setCarouselForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600" />
            <input type="text" placeholder="Subtitle (optional)" value={carouselForm.subtitle} onChange={e => setCarouselForm(f => ({ ...f, subtitle: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600" />
            <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg transition">Add Slide</button>
          </form>
          <div className="space-y-2">
            {carousel.map(slide => (
              <div key={slide.id} className="flex items-center gap-3 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-3">
                {slide.image_url && <img src={slide.image_url} alt="" className="h-10 w-20 rounded-lg object-cover" />}
                <div className="flex-1">
                  <p className="text-white text-sm">{slide.title || 'No title'}</p>
                  <p className="text-gray-600 text-xs">{slide.subtitle}</p>
                </div>
                <button onClick={() => handleDeleteCarousel(slide.id)} className="p-1.5 text-red-600 hover:text-red-400 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#141414] border border-[#1f1f1f] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#1f1f1f]">
              <h2 className="text-white font-semibold">{editProduct ? 'Edit Watch' : 'Add New Watch'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Watch Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Royal Oak Chronograph"
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600" />
              </div>

              {/* Category + Subcategory */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Sub-category</label>
                  <select value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600">
                    <option value="">None</option>
                    <option value="metal">Metal Strip</option>
                    <option value="leather">Leather Strip</option>
                  </select>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Original Price (৳) *</label>
                  <input required type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} placeholder="5000"
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Sale Price (৳) *</label>
                  <input required type="number" value={form.discount_price} onChange={e => setForm(f => ({ ...f, discount_price: e.target.value }))} placeholder="3500"
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Delivery (৳)</label>
                  <input type="number" value={form.delivery_fee} onChange={e => setForm(f => ({ ...f, delivery_fee: e.target.value }))} placeholder="60"
                    className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Description / Details</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Watch specifications, features..."
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 resize-none" />
              </div>

              {/* Images */}
              <div>
                <label className="text-gray-400 text-xs mb-2 block">Product Images (up to 3)</label>
                <div className="space-y-2">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-12 h-12 rounded-lg border border-[#2a2a2a] overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#0f0f0f]`}>
                        {form.images[i] ? (
                          <img src={form.images[i]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files[0], i)}
                          className="block w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-emerald-900/40 file:text-emerald-400 file:text-xs" />
                        {uploading[i] && <p className="text-emerald-400 text-[10px] mt-0.5">Uploading...</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Available</p>
                  <p className="text-gray-600 text-xs">Toggle off to show as "Not Available"</p>
                </div>
                <button type="button" onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.available ? 'bg-emerald-700' : 'bg-gray-700'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.available ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-[#2a2a2a] text-gray-400 hover:text-white py-3 rounded-xl text-sm transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition">
                  {saving ? 'Saving...' : editProduct ? 'Update Watch' : 'Add Watch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
