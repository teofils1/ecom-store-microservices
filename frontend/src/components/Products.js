import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = ({ addToCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const getCategories = () => {
    const categories = ['All', ...new Set(products.map(p => p.category))];
    return categories;
  };

  const isInCart = (productId) => {
    return cart.find(item => item.id === productId);
  };

  const getProductIcon = (category) => {
    const icons = {
      'Electronics': '💻',
      'Accessories': '🎧',
      'Peripherals': '⌨️',
      'Storage': '💾',
      'Lighting': '💡',
      'Default': '📦'
    };
    return icons[category] || icons['Default'];
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={fetchProducts} className="btn-primary">Try Again</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <h2>No products available</h2>
        <p>Check back later for new products!</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header Section */}
      <div className="products-header">
        <h2>Discover Our Products</h2>
        <p className="subtitle">Find the perfect tech gear for your needs</p>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {getCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="stock">Stock Quantity</option>
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ▦
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>
          Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'product-grid' : 'product-list'}>
          {filteredProducts.map(product => {
            const inCart = isInCart(product.id);
            const isAvailable = product.available && product.stockQuantity > 0;

            return (
              <div key={product.id} className={`product-card ${!isAvailable ? 'out-of-stock' : ''}`}>
                <div className="product-image">
                  <span className="product-icon">{getProductIcon(product.category)}</span>
                  {inCart && <div className="in-cart-badge">In Cart ✓</div>}
                  {!isAvailable && <div className="out-of-stock-overlay">Out of Stock</div>}
                </div>

                <div className="product-info">
                  <div className="product-category">
                    {product.category}
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>

                  <div className="product-details">
                    <div className="stock-info">
                      {isAvailable ? (
                        <>
                          <span className="stock-badge available">✓ In Stock</span>
                          <span className="stock-quantity">{product.stockQuantity} units</span>
                        </>
                      ) : (
                        <span className="stock-badge unavailable">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="product-footer">
                  <div className="product-price">
                    <span className="currency">$</span>
                    <span className="amount">{product.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!isAvailable}
                    className={`add-to-cart-btn ${inCart ? 'in-cart' : ''}`}
                  >
                    {isAvailable ? (
                      inCart ? (
                        <>Add More <span className="btn-icon">+</span></>
                      ) : (
                        <>Add to Cart <span className="btn-icon">🛒</span></>
                      )
                    ) : (
                      'Unavailable'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
