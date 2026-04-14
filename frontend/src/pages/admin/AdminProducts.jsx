import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';
import './AdminProducts.css';

/**
 * AdminProducts — Full product management table with edit/delete/toggle actions.
 */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products/admin/all');
      setProducts(data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the store?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.map((p) => p._id === id ? { ...p, isActive: false } : p));
    } catch (err) {
      alert('Failed to delete product.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (product) => {
    try {
      const { data } = await api.put(`/products/${product._id}`, { isActive: !product.isActive });
      setProducts((prev) => prev.map((p) => p._id === product._id ? data : p));
    } catch (err) {
      alert('Failed to toggle product visibility.');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-content">
          {/* Header */}
          <div className="admin-page-header">
            <div>
              <h1>Products</h1>
              <p>{products.length} products in inventory</p>
            </div>
            <Link to="/admin/products/add" className="btn btn-primary">+ Add Product</Link>
          </div>

          {/* Search */}
          <div className="admin-search-bar">
            <input
              className="form-input"
              type="text"
              placeholder="Search by name or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="admin-product-search"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="spinner-wrapper"><div className="spinner" /></div>
          ) : (
            <div className="table-wrapper card">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state" style={{ padding: '2rem' }}>
                          <span className="empty-icon">🔍</span>
                          <h3>No products found</h3>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((product) => (
                    <tr key={product._id} className={!product.isActive ? 'row-inactive' : ''}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-thumb"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50x60'; }}
                        />
                      </td>
                      <td>
                        <div className="product-table-name">{product.name}</div>
                        <div className="product-table-sizes">{product.sizes?.join(', ')}</div>
                      </td>
                      <td>
                        <span className="badge-category" style={{ fontSize: '0.75rem' }}>
                          {product.category}
                        </span>
                      </td>
                      <td><strong>₹{product.price.toLocaleString('en-IN')}</strong></td>
                      <td>
                        <span className={product.stock === 0 ? 'stock-out' : product.stock <= 5 ? 'stock-low' : 'stock-ok'}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`toggle-btn ${product.isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleToggle(product)}
                          title={product.isActive ? 'Click to hide' : 'Click to show'}
                        >
                          {product.isActive ? '● Active' : '○ Hidden'}
                        </button>
                      </td>
                      <td>
                        <div className="action-btns">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="btn btn-sm btn-outline"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={deleting === product._id || !product.isActive}
                          >
                            {deleting === product._id ? '…' : 'Delete'}
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
      </main>
    </div>
  );
};

export default AdminProducts;
