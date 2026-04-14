import axios from 'axios';

/**
 * Preconfigured Axios instance.
 * - Base URL: /api (proxied to http://localhost:5000 by Vite in dev)
 * - Automatically attaches JWT token from localStorage to every request
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach Authorization header ──────────────────────────
api.interceptors.request.use(
  (config) => {
    // Get token stored after login
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 Unauthorized globally ───────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is expired or invalid, clear storage and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
