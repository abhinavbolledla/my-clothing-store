import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute — Redirects to / if user is not an admin.
 * Must be used inside ProtectedRoute (assumes user is already logged in).
 */
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect non-admins to the home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
