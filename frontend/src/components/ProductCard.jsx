import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

/**
 * ProductCard — Displays a single product in a card layout.
 * Used on Home, Products, and admin pages.
 *
 * Props:
 *  - product: Product object from API
 *  - onAddToCart: function(product) — called when "Add to Cart" clicked
 */
const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card card fade-in">
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="product-card-img-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
          }}
        />
        {/* Badges */}
        <div className="product-card-badges">
          <span className="badge-category">{product.category}</span>
          {isOutOfStock && <span className="badge-oos">Out of Stock</span>}
        </div>
      </Link>

      {/* Product Info */}
      <div className="product-card-body">
        <Link to={`/products/${product._id}`} className="product-card-name">
          {product.name}
        </Link>

        <p className="product-card-desc">{product.description}</p>

        {/* Sizes */}
        <div className="product-card-sizes">
          {product.sizes.map((size) => (
            <span key={size} className="size-chip">{size}</span>
          ))}
        </div>

        {/* Price + Add to Cart */}
        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>

          {onAddToCart && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Sold Out' : '+ Cart'}
            </button>
          )}
        </div>

        {/* Stock indicator */}
        {!isOutOfStock && product.stock <= 5 && (
          <p className="low-stock-warning">⚠️ Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
