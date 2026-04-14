import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer — Site-wide footer with links and branding.
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">👗 StyleHub</Link>
            <p>Your go-to destination for premium clothing for the whole family — Men, Women & Kids.</p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h5>Shop</h5>
            <ul>
              <li><Link to="/products?category=Men">Men's Collection</Link></li>
              <li><Link to="/products?category=Women">Women's Collection</Link></li>
              <li><Link to="/products?category=Kids">Kids' Collection</Link></li>
              <li><Link to="/products">All Products</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="footer-col">
            <h5>Account</h5>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="footer-col">
            <h5>Info</h5>
            <ul>
              <li><span>📍 Bangalore, India</span></li>
              <li><span>📧 hello@stylehub.in</span></li>
              <li><span>📞 +91 98765 43210</span></li>
              <li><span>⏰ Mon–Sat 9AM–6PM</span></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StyleHub. All rights reserved.</p>
          <p>Built with ❤️ using MERN Stack</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
