import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Navbar — Responsive top navigation bar with:
 * - Brand logo
 * - Category links
 * - Cart icon with item count
 * - User auth state (login/logout)
 * - Mobile hamburger menu
 */
const Navbar = ({ cartCount = 0 }) => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">👗</span>
          <span>StyleHub</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>All</NavLink></li>
          <li><NavLink to="/products?category=Men" className={({ isActive }) => isActive ? 'active' : ''}>Men</NavLink></li>
          <li><NavLink to="/products?category=Women" className={({ isActive }) => isActive ? 'active' : ''}>Women</NavLink></li>
          <li><NavLink to="/products?category=Kids" className={({ isActive }) => isActive ? 'active' : ''}>Kids</NavLink></li>
        </ul>

        {/* Right Controls */}
        <div className="navbar-actions">
          {/* Cart icon */}
          <Link to="/cart" className="cart-btn" aria-label="Shopping cart">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
              {isAdmin && (
                <Link to="/admin" className="btn btn-sm btn-outline">Admin</Link>
              )}
              <Link to="/orders" className="btn btn-sm btn-ghost">Orders</Link>
              <button onClick={handleLogout} className="btn btn-sm btn-danger">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login"    className="btn btn-sm btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/"                     onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products"             onClick={() => setMenuOpen(false)}>All Products</Link>
          <Link to="/products?category=Men"    onClick={() => setMenuOpen(false)}>Men</Link>
          <Link to="/products?category=Women"  onClick={() => setMenuOpen(false)}>Women</Link>
          <Link to="/products?category=Kids"   onClick={() => setMenuOpen(false)}>Kids</Link>
          <Link to="/cart"                 onClick={() => setMenuOpen(false)}>🛒 Cart ({cartCount})</Link>
          {isLoggedIn ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
              <button onClick={handleLogout} className="mobile-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
