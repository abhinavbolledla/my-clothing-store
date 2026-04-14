import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create context
const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides auth state + actions to all children.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // Prevents flicker on page refresh

  // ── On mount: rehydrate user from localStorage ──────────────────────────────
  useEffect(() => {
    const savedUser  = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    // Persist token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // ── Register ─────────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Computed helpers
  const isLoggedIn = !!user;
  const isAdmin    = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth — custom hook to consume AuthContext anywhere in the app.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};

export default AuthContext;
