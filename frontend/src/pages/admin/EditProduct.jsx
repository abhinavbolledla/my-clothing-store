import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';
import './ProductForm.css';

/**
 * EditProduct — Admin form to update an existing product.
 * Pre-fills all fields from the API and supports partial updates.
 */
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', description: '', category: 'Men',
    price: '', stock: '', image: '', sizes: [],
  });

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const allSizes = ['S', 'M', 'L', 'XL'];

  // Pre-load product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setForm({
          name:        data.name,
          description: data.description,
          category:    data.category,
          price:       data.price,
          stock:       data.stock,
          image:       data.image,
          sizes:       data.sizes,
        });
      } catch (err) {
        setError('Failed to load product. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError('');
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.sizes.length === 0) {
      return setError('Please select at least one size.');
    }

    setSaving(true);
    try {
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setSuccess('Product updated successfully!');
      setTimeout(() => navigate('/admin/products'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="spinner-wrapper"><div className="spinner" /></div>
      </main>
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-page-header">
            <div>
              <h1>Edit Product</h1>
              <p>Update product details and save changes</p>
            </div>
            <button onClick={() => navigate('/admin/products')} className="btn btn-ghost">← Back</button>
          </div>

          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="product-form-grid">
            {/* Form */}
            <form onSubmit={handleSubmit} className="product-form card">
              <div className="form-section">
                <h4 className="form-section-title">Basic Information</h4>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">Product Name *</label>
                  <input id="name" type="text" className="form-input"
                    value={form.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea id="description" className="form-textarea"
                    value={form.description} onChange={handleChange} required rows={4} />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">Category *</label>
                    <select id="category" className="form-select"
                      value={form.category} onChange={handleChange}>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="price" className="form-label">Price (₹) *</label>
                    <input id="price" type="number" className="form-input"
                      min="0" value={form.price} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="stock" className="form-label">Stock Quantity *</label>
                  <input id="stock" type="number" className="form-input"
                    min="0" value={form.stock} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">Sizes</h4>
                <div className="size-checkboxes">
                  {allSizes.map((size) => (
                    <label key={size} className={`size-checkbox ${form.sizes.includes(size) ? 'checked' : ''}`}>
                      <input type="checkbox"
                        checked={form.sizes.includes(size)}
                        onChange={() => toggleSize(size)} />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">Product Image</h4>
                <div className="form-group">
                  <label htmlFor="image" className="form-label">Image URL</label>
                  <input id="image" type="url" className="form-input"
                    placeholder="https://…" value={form.image} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={saving}>
                {saving ? 'Saving…' : '✓ Save Changes'}
              </button>
            </form>

            {/* Live Preview */}
            <div className="product-preview">
              <h4 className="form-section-title" style={{ marginBottom: '1rem' }}>Live Preview</h4>
              <div className="preview-card card">
                <div className="preview-img-wrapper">
                  {form.image ? (
                    <img src={form.image} alt="Preview"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x380?text=Invalid+URL'; }} />
                  ) : (
                    <div className="preview-placeholder">📷 Image Preview</div>
                  )}
                  {form.category && (
                    <span className="badge-category preview-badge">{form.category}</span>
                  )}
                </div>
                <div className="preview-body">
                  <p className="preview-name">{form.name}</p>
                  <p className="preview-desc">{form.description}</p>
                  <div className="preview-sizes">
                    {form.sizes.map((s) => <span key={s} className="size-chip">{s}</span>)}
                  </div>
                  <div className="preview-footer">
                    <span className="preview-price">₹{Number(form.price || 0).toLocaleString('en-IN')}</span>
                    <span className="preview-stock">Stock: {form.stock}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
