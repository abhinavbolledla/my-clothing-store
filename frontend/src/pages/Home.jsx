import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import './Home.css';

/**
 * Home Page — Hero banner + featured products + category shortcuts.
 */
const Home = ({ onAddToCart }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Men', 'Women', 'Kids'];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const params = activeCategory !== 'All' ? `?category=${activeCategory}&limit=8` : '?limit=8';
        const { data } = await api.get(`/products${params}`);
        setFeatured(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [activeCategory]);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) return navigate('/login');
    onAddToCart(product);
  };

  return (
    <div className="home-page">
      {/* ── Hero Section ──────────────────────────── */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-text fade-in">
            <span className="hero-badge">New Collection 2024</span>
            <h1>Style That <br /><span className="hero-gradient">Speaks For You</span></h1>
            <p>Discover premium clothing for Men, Women & Kids. Curated fashion that fits your lifestyle — delivered to your door.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now →
              </Link>
              <Link to="/products?category=Women" className="btn btn-outline btn-lg">
                New Arrivals
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>500+</strong><span>Products</span></div>
              <div className="stat"><strong>3</strong><span>Categories</span></div>
              <div className="stat"><strong>Fast</strong><span>Delivery</span></div>
            </div>
          </div>
          <div className="hero-visual fade-in">
            <div className="hero-img-grid">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=400&fit=crop" alt="Fashion 1" className="hero-img hero-img-1" />
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=360&fit=crop" alt="Fashion 2" className="hero-img hero-img-2" />
              <img src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=280&h=320&fit=crop" alt="Fashion 3" className="hero-img hero-img-3" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Shortcuts ────────────────────── */}
      <section className="categories-section container section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-cards">
          {[
            { name: 'Men', emoji: '👔', bg: '#dbeafe', textColor: '#1e40af', img: 'https://images.unsplash.com/photo-1617952739046-c9f18ecb094a?w=400&h=300&fit=crop' },
            { name: 'Women', emoji: '👗', bg: '#fce7f3', textColor: '#831843', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop' },
            { name: 'Kids', emoji: '🧒', bg: '#dcfce7', textColor: '#166534', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="category-card fade-in"
            >
              <img src={cat.img} alt={cat.name} />
              <div className="category-card-overlay">
                <span className="category-emoji">{cat.emoji}</span>
                <h3>{cat.name}'s Collection</h3>
                <span className="category-cta">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────── */}
      <section className="featured-section container section">
        <div className="featured-header">
          <h2 className="section-title">Featured Products</h2>
          <div className="category-filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat); setLoading(true); }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrapper"><div className="spinner" /></div>
        ) : (
          <div className="products-grid">
            {featured.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        <div className="view-all-wrapper">
          <Link to="/products" className="btn btn-outline btn-lg">View All Products</Link>
        </div>
      </section>

      {/* ── Trust Badges ──────────────────────────── */}
      <section className="trust-section">
        <div className="container trust-grid">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% safe & encrypted' },
            { icon: '⭐', title: 'Premium Quality', desc: 'Curated clothing brands' },
          ].map((item) => (
            <div key={item.title} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <div>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
