import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import api from './api/axios';

// ── Layout Components ─────────────────────────────────────────────
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// ── Customer Pages ────────────────────────────────────────────────
import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Orders        from './pages/Orders';
import Login         from './pages/Login';
import Register      from './pages/Register';

// ── Admin Pages ───────────────────────────────────────────────────
import Dashboard     from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders   from './pages/admin/AdminOrders';
import AddProduct    from './pages/admin/AddProduct';
import EditProduct   from './pages/admin/EditProduct';

// ─────────────────────────────────────────────────────────────────
// FooterWrapper — hides Footer on /admin routes
// Must be rendered inside <Router> so useLocation() works.
// ─────────────────────────────────────────────────────────────────
const FooterWrapper = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Footer />;
};

// ─────────────────────────────────────────────────────────────────
// NavbarWrapper — passes live cart count, hidden on /admin
// ─────────────────────────────────────────────────────────────────
const NavbarWrapper = ({ cartCount }) => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Navbar cartCount={cartCount} />;
};

// ─────────────────────────────────────────────────────────────────
// AppRoutes — All route definitions + global cart state management
// ─────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  const { isLoggedIn } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart badge count whenever auth state changes
  const fetchCartCount = useCallback(async () => {
    if (!isLoggedIn) { setCartCount(0); return; }
    try {
      const { data } = await api.get('/cart');
      const count = data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, [isLoggedIn]);

  useEffect(() => { fetchCartCount(); }, [fetchCartCount]);

  // Global add-to-cart handler — called from ProductCard and ProductDetail
  const handleAddToCart = async (product, size = 'M', quantity = 1) => {
    try {
      await api.post('/cart', { productId: product._id, size, quantity });
      await fetchCartCount(); // Refresh badge
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart. Please log in and try again.');
    }
  };

  return (
    <>
      <NavbarWrapper cartCount={cartCount} />

      <Routes>
        {/* ── Public Routes ─────────────────────────────────── */}
        <Route path="/"             element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/products"     element={<Products onAddToCart={handleAddToCart} />} />
        <Route path="/products/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />

        {/* ── Protected Customer Routes ─────────────────────── */}
        <Route path="/cart"   element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* ── Protected Admin Routes ────────────────────────── */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminRoute><Dashboard /></AdminRoute></ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute><AdminRoute><AdminProducts /></AdminRoute></ProtectedRoute>
        } />
        <Route path="/admin/products/add" element={
          <ProtectedRoute><AdminRoute><AddProduct /></AdminRoute></ProtectedRoute>
        } />
        <Route path="/admin/products/edit/:id" element={
          <ProtectedRoute><AdminRoute><EditProduct /></AdminRoute></ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute><AdminRoute><AdminOrders /></AdminRoute></ProtectedRoute>
        } />

        {/* ── 404 Fallback ──────────────────────────────────── */}
        <Route path="*" element={
          <div className="page-content">
            <div className="container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
              <p style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</p>
              <h1>404 — Page Not Found</h1>
              <p style={{ margin: '1rem 0 2rem' }}>The page you're looking for doesn't exist.</p>
              <a href="/" className="btn btn-primary btn-lg">← Go Home</a>
            </div>
          </div>
        } />
      </Routes>

      <FooterWrapper />
    </>
  );
};

// ─────────────────────────────────────────────────────────────────
// App — Root component. Wraps everything in Router + AuthProvider.
// ─────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
