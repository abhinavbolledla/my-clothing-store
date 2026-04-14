import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './Orders.css';

/**
 * Orders Page — User's complete order history with status and item breakdown.
 */
const Orders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (err) {
        setError('Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusIcon = {
    pending:    '🕐',
    processing: '⚙️',
    shipped:    '🚚',
    delivered:  '✅',
    cancelled:  '❌',
  };

  if (loading) return <div className="spinner-wrapper page-content"><div className="spinner" /></div>;
  if (error)   return <div className="page-content container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="orders-page page-content">
      <div className="container">
        <h1>My Orders</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          {orders.length === 0 ? '' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
        </p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No orders yet</h3>
            <p>Once you place an order, it will appear here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card card fade-in">
                {/* Order Header */}
                <div
                  className="order-header"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <div className="order-meta">
                    <div>
                      <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="order-thumb"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                        />
                      ))}
                      {order.items.length > 3 && (
                        <span className="order-thumb-more">+{order.items.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="order-summary-right">
                    <span className={`badge badge-${order.status}`}>
                      {statusIcon[order.status]} {order.status}
                    </span>
                    <strong className="order-total">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                    <span className="expand-icon">{expanded === order._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expanded === order._id && (
                  <div className="order-details fade-in">
                    <hr className="divider" />

                    {/* Items */}
                    <h5 style={{ marginBottom: '1rem' }}>Items Ordered</h5>
                    <div className="order-items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="order-item-img"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                          />
                          <div className="order-item-info">
                            <span className="order-item-name">{item.name}</span>
                            <span className="order-item-meta">Size: {item.size} | Qty: {item.quantity}</span>
                          </div>
                          <strong className="order-item-price">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <hr className="divider" />

                    {/* Shipping + Summary */}
                    <div className="order-footer-grid">
                      <div className="order-shipping">
                        <h5>Shipping Address</h5>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                        <p>PIN: {order.shippingAddress.pincode}</p>
                      </div>
                      <div className="order-breakdown">
                        <div className="summary-row">
                          <span>Subtotal</span>
                          <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="summary-row">
                          <span>Payment</span>
                          <strong>{order.paymentMethod}</strong>
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
    </div>
  );
};

export default Orders;
