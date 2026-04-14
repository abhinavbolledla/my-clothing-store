import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

/**
 * ProductDetail — Full product view with image, details, size picker, and add-to-cart.
 */
const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty]             = useState(1);
  const [added, setAdded]         = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        // Auto-select first available size
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
      } catch (err) {
        setError('Product not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) return navigate('/login');
    if (!selectedSize) return alert('Please select a size');

    onAddToCart(product, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) return <div className="spinner-wrapper page-content"><div className="spinner" /></div>;
  if (error)   return <div className="page-content container"><div className="alert alert-error">{error}</div></div>;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-detail-page page-content">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">← Back</button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-img-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-img"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/500x600?text=No+Image'; }}
            />
            <div className="product-detail-badges">
              <span className="badge-category">{product.category}</span>
            </div>
          </div>

          {/* Info Panel */}
          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-price-row">
              <span className="product-detail-price">₹{product.price.toLocaleString('en-IN')}</span>
              {isOutOfStock
                ? <span className="badge badge-cancelled">Out of Stock</span>
                : <span className="badge badge-delivered">In Stock ({product.stock})</span>
              }
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <hr className="divider" />

            {/* Size Selector */}
            <div className="size-section">
              <div className="size-header">
                <h5>Select Size</h5>
                <span className="selected-size-label">{selectedSize}</span>
              </div>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="qty-section">
              <h5>Quantity</h5>
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >−</button>
                <span className="qty-value">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                >+</button>
              </div>
            </div>

            <hr className="divider" />

            {/* Actions */}
            <div className="product-detail-actions">
              <button
                className={`btn btn-lg btn-full ${added ? 'btn-accent' : 'btn-primary'}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Out of Stock' : added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button
                className="btn btn-lg btn-outline btn-full"
                onClick={() => { handleAddToCart(); navigate('/cart'); }}
                disabled={isOutOfStock}
              >
                Buy Now
              </button>
            </div>

            {/* Product Meta */}
            <div className="product-meta">
              <div className="meta-item"><span>Category:</span> <strong>{product.category}</strong></div>
              <div className="meta-item"><span>Available Sizes:</span> <strong>{product.sizes.join(', ')}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
