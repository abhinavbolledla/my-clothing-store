import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import './Products.css';

/**
 * Products Page — Browse all products with category and search filters.
 */
const Products = ({ onAddToCart }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const category = searchParams.get('category') || '';
  const search   = searchParams.get('search')   || '';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (search)   params.set('search', search);
        params.set('page', currentPage);
        params.set('limit', 12);

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, currentPage]);

  const handleCategoryChange = (cat) => {
    const params = {};
    if (cat) params.category = cat;
    if (search) params.search = search;
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (category) params.category = category;
    if (searchInput.trim()) params.search = searchInput.trim();
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) return navigate('/login');
    onAddToCart(product);
  };

  const categories = ['', 'Men', 'Women', 'Kids'];
  const catLabels  = { '': 'All', Men: 'Men', Women: 'Women', Kids: 'Kids' };

  return (
    <div className="products-page page-content">
      <div className="container">
        <div className="products-header">
          <div>
            <h1>
              {category ? `${category}'s Collection` : 'All Products'}
            </h1>
            <p>{loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              className="form-input"
              placeholder="Search products…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              id="product-search"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="products-sidebar">
            <div className="sidebar-section">
              <h5>Category</h5>
              <ul className="filter-list">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`filter-option ${category === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {catLabels[cat]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="products-main">
            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
              <div className="spinner-wrapper"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try a different search or category</p>
              </div>
            ) : (
              <div className="product-grid-responsive">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
