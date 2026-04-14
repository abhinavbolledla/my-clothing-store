import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Cart.css';

/**
 * Cart Page — View all items, update quantities, remove items, and checkout.
 */
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Shipping address form state
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (itemId, newQty) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity: newQty });
      setCart(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data);
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Clear your entire cart?')) return;
    try {
      await api.delete('/cart');
      fetchCart();
    } catch (err) {
      alert('Failed to clear cart');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    try {
      await api.post('/orders', { shippingAddress: address });
      setOrderSuccess(true);
      setShowCheckout(false);
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Compute total
  const cartTotal = cart?.items?.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;

  if (loading) return <div className="spinner-wrapper page-content"><div className="spinner" /></div>;
  if (error)   return <div className="page-content container"><div className="alert alert-error">{error}</div></div>;

  const items = cart?.items || [];

  return (
    <div className="cart-page page-content">
      <div className="container">
        <h1>My Cart {items.length > 0 && <span className="cart-count">({items.length})</span>}</h1>

        {/* Order success message */}
        {orderSuccess && (
          <div className="alert alert-success">
            🎉 Order placed successfully! <Link to="/orders">View my orders →</Link>
            <button onClick={() => setOrderSuccess(false)} className="btn btn-sm btn-ghost" style={{marginLeft:'auto'}}>✕</button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Browse our collection and add something you love!</p>
            <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: '1rem' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-header-row">
                <span>Product</span>
                <span>Size</span>
                <span>Qty</span>
                <span>Price</span>
                <span></span>
              </div>

              {items.map((item) => (
                <div key={item._id} className="cart-item fade-in">
                  {/* Image */}
                  <div className="cart-item-img-wrapper">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/80x100'; }}
                    />
                  </div>

                  {/* Name */}
                  <div className="cart-item-name">
                    <Link to={`/products/${item.product?._id}`}>{item.product?.name}</Link>
                  </div>

                  {/* Size */}
                  <div className="cart-item-size">
                    <span className="size-chip">{item.size}</span>
                  </div>

                  {/* Quantity Control */}
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.quantity + 1)} disabled={item.quantity >= item.product?.stock}>+</button>
                  </div>

                  {/* Price */}
                  <div className="cart-item-price">
                    ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </div>

                  {/* Remove */}
                  <button className="cart-remove-btn" onClick={() => removeItem(item._id)} title="Remove item">✕</button>
                </div>
              ))}

              <div className="cart-actions">
                <button className="btn btn-ghost btn-sm" onClick={clearCart}>🗑 Clear Cart</button>
                <Link to="/products" className="btn btn-outline btn-sm">← Continue Shopping</Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3>Order Summary</h3>
                <hr className="divider" />

                <div className="summary-row">
                  <span>Subtotal ({items.length} items)</span>
                  <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <strong className="free-delivery">{cartTotal >= 999 ? 'FREE' : '₹99'}</strong>
                </div>
                <hr className="divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <strong>₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}</strong>
                </div>

                {cartTotal < 999 && (
                  <p className="free-delivery-notice">
                    Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for FREE delivery!
                  </p>
                )}

                <button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={() => setShowCheckout(true)}
                  style={{ marginTop: '1rem' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Checkout Modal ──────────────────────────────── */}
        {showCheckout && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCheckout(false)}>
            <div className="modal fade-in">
              <div className="modal-header">
                <h3>Shipping Details</h3>
                <button className="modal-close" onClick={() => setShowCheckout(false)}>✕</button>
              </div>

              <form onSubmit={handlePlaceOrder}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input className="form-input" placeholder="123 Main St, Apt 4B" required
                    value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" placeholder="Bangalore" required
                      value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" placeholder="Karnataka" required
                      value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code</label>
                  <input className="form-input" placeholder="560001" required
                    value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                </div>

                <div className="modal-total">
                  <span>Order Total:</span>
                  <strong>₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}</strong>
                </div>
                <p className="modal-payment-note">💳 Payment method: Cash on Delivery</p>

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={checkoutLoading}>
                  {checkoutLoading ? 'Placing Order…' : '🛒 Place Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
