import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';
import './AdminOrders.css';

/**
 * AdminOrders — Full orders management table for the admin panel.
 * Supports status updates and expanded order details.
 */
const AdminOrders = () => {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [expanded, setExpanded]     = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: data.status } : o));
    } catch (err) {
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusIcon = {
    pending:    '🕐',
    processing: '⚙️',
    shipped:    '🚚',
    delivered:  '✅',
    cancelled:  '❌',
  };

  const filtered = orders.filter((o) => !filterStatus || o.status === filterStatus);

  // Summary counts
  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-content">
          {/* Header */}
          <div className="admin-page-header">
            <div>
              <h1>Orders</h1>
              <p>{orders.length} total orders</p>
            </div>
          </div>

          {/* Status Summary Pills */}
          <div className="order-status-pills">
            <button
              className={`status-pill ${filterStatus === '' ? 'active' : ''}`}
              onClick={() => setFilterStatus('')}
            >
              All <span>{orders.length}</span>
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`status-pill status-pill-${s} ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s === filterStatus ? '' : s)}
              >
                {statusIcon[s]} {s} <span>{statusCounts[s]}</span>
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="spinner-wrapper"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No orders {filterStatus ? `with status "${filterStatus}"` : 'yet'}</h3>
            </div>
          ) : (
            <div className="orders-admin-list">
              {filtered.map((order) => (
                <div key={order._id} className="order-admin-card card">
                  {/* Row Header */}
                  <div className="order-admin-row">
                    <div className="order-admin-id">
                      <span className="order-id-cell">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className="order-admin-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="order-admin-customer">
                      <div className="customer-avatar">{order.user?.name?.charAt(0) || '?'}</div>
                      <div>
                        <p className="customer-name">{order.user?.name || 'Unknown'}</p>
                        <p className="customer-email">{order.user?.email || ''}</p>
                      </div>
                    </div>

                    <div className="order-admin-items-preview">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img key={idx} src={item.image} alt={item.name}
                          className="order-thumb"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                      ))}
                      {order.items.length > 3 && (
                        <span className="order-thumb-more">+{order.items.length - 3}</span>
                      )}
                      <span className="order-item-count">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    </div>

                    <div className="order-admin-total">
                      <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                    </div>

                    {/* Status Dropdown */}
                    <div className="order-status-control">
                      <select
                        className={`status-select status-${order.status}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusIcon[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      {updatingId === order._id && (
                        <span className="updating-spinner" />
                      )}
                    </div>

                    {/* Expand toggle */}
                    <button
                      className="expand-toggle"
                      onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    >
                      {expanded === order._id ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expanded === order._id && (
                    <div className="order-admin-details fade-in">
                      <hr className="divider" />

                      <div className="order-admin-expand-grid">
                        {/* Items */}
                        <div>
                          <h5 style={{ marginBottom: '0.75rem' }}>Items</h5>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="admin-order-item">
                              <img src={item.image} alt={item.name}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                              <div className="admin-order-item-info">
                                <span>{item.name}</span>
                                <span className="admin-order-item-meta">
                                  Size: {item.size} · Qty: {item.quantity} · ₹{item.price.toLocaleString('en-IN')} each
                                </span>
                              </div>
                              <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                            </div>
                          ))}
                        </div>

                        {/* Shipping */}
                        <div>
                          <h5 style={{ marginBottom: '0.75rem' }}>Shipping Address</h5>
                          <div className="shipping-info">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>PIN: {order.shippingAddress.pincode}</p>
                          </div>

                          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                            <div className="summary-row">
                              <span>Payment</span>
                              <strong>{order.paymentMethod}</strong>
                            </div>
                            <div className="summary-row">
                              <span>Total</span>
                              <strong style={{ color: 'var(--primary)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
