import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

/**
 * Admin Dashboard — Stats overview + recent orders + low stock alerts.
 */
const Dashboard = () => {
  const [stats, setStats]           = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [recentOrders, setRecent]   = useState([]);
  const [lowStock, setLowStock]     = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          api.get('/orders/stats/dashboard'),
          api.get('/orders'),
          api.get('/products/admin/all'),
        ]);

        setStats(statsRes.data);
        setRecent(ordersRes.data.slice(0, 5));
        setTotalProducts(productsRes.data.length);

        // Products with stock ≤ 5
        const low = productsRes.data.filter((p) => p.stock <= 5 && p.isActive);
        setLowStock(low);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statusBadge = (status) => (
    <span className={`badge badge-${status}`}>{status}</span>
  );

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
          {/* ── Page Header ────────────────────────── */}
          <div className="admin-page-header">
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back! Here's what's happening in your store.</p>
            </div>
            <Link to="/admin/products/add" className="btn btn-primary">
              + Add Product
            </Link>
          </div>

          {/* ── Stat Cards ─────────────────────────── */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#ede9fe' }}>📦</div>
              <div className="stat-card-info">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#dcfce7' }}>💰</div>
              <div className="stat-card-info">
                <p className="stat-label">Revenue</p>
                <p className="stat-value">₹{(stats.totalRevenue / 1000).toFixed(1)}k</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#fef3c7' }}>🕐</div>
              <div className="stat-card-info">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{stats.pendingOrders}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: '#dbeafe' }}>👕</div>
              <div className="stat-card-info">
                <p className="stat-label">Products</p>
                <p className="stat-value">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* ── Recent Orders ──────────────────────── */}
            <div className="card dashboard-card">
              <div className="card-header">
                <h3>Recent Orders</h3>
                <Link to="/admin/orders" className="btn btn-sm btn-ghost">View All</Link>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet</td></tr>
                    ) : recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="order-id-cell">#{order._id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td><strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong></td>
                        <td>{statusBadge(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Low Stock Alerts ──────────────────── */}
            <div className="card dashboard-card">
              <div className="card-header">
                <h3>Low Stock Alerts</h3>
                <Link to="/admin/products" className="btn btn-sm btn-ghost">Manage</Link>
              </div>
              {lowStock.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  ✅ All products are well-stocked
                </div>
              ) : (
                <div className="low-stock-list">
                  {lowStock.map((p) => (
                    <div key={p._id} className="low-stock-item">
                      <img src={p.image} alt={p.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                      <div className="low-stock-info">
                        <span className="low-stock-name">{p.name}</span>
                        <span className="low-stock-cat">{p.category}</span>
                      </div>
                      <span className={`low-stock-qty ${p.stock === 0 ? 'out' : 'low'}`}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
