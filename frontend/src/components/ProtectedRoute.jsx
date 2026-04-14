import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Redirects to /login if user is not authenticated.
 * Wrap any route that requires login with this component.
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  // Show nothing while checking stored auth state (prevents flicker)
  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
