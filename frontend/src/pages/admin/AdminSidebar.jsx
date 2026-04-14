import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

/**
 * AdminSidebar — Persistent dark sidebar for the admin panel.
 * Shared across all admin pages.
 */
const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin',          label: 'Dashboard',   icon: '📊', end: true },
    { to: '/admin/products', label: 'Products',    icon: '👕' },
    { to: '/admin/orders',   label: 'Orders',      icon: '📦' },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="admin-brand">
        <Link to="/" className="admin-logo">👗 StyleHub</Link>
        <span className="admin-label">Admin Panel</span>
      </div>

      {/* User Info */}
      <div className="admin-user">
        <div className="admin-avatar">{user?.name?.charAt(0)}</div>
        <div>
          <p className="admin-user-name">{user?.name}</p>
          <p className="admin-user-role">Administrator</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/" className="admin-nav-link">
          <span className="nav-icon">🏠</span> View Store
        </Link>
        <button onClick={handleLogout} className="admin-nav-link admin-logout-btn">
          <span className="nav-icon">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
