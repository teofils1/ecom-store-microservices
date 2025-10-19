import React, { useState, useEffect } from 'react';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';

function App() {
  const [currentView, setCurrentView] = useState('products');
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      showNotification(`Added another ${product.name} to cart!`);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      showNotification(`${product.name} added to cart!`);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(cart.filter(item => item.id !== productId));
    if (item) {
      showNotification(`${item.name} removed from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Cart cleared!', 'info');
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="App">
      {/* Notification Toast */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🛍️</span>
              <div className="logo-text">
                <h1>TechStore</h1>
                <p className="tagline">Your Modern E-Commerce Platform</p>
              </div>
            </div>
            <div className="nav">
              <button
                className={`nav-btn ${currentView === 'products' ? 'active' : ''}`}
                onClick={() => setCurrentView('products')}
              >
                <span className="nav-icon">🏠</span>
                <span>Shop</span>
              </button>
              <button
                className={`nav-btn ${currentView === 'cart' ? 'active' : ''}`}
                onClick={() => setCurrentView('cart')}
              >
                <span className="nav-icon">🛒</span>
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="badge">{getTotalItems()}</span>
                )}
              </button>
              <button
                className={`nav-btn ${currentView === 'checkout' ? 'active' : ''}`}
                onClick={() => setCurrentView('checkout')}
                disabled={cart.length === 0}
              >
                <span className="nav-icon">💳</span>
                <span>Checkout</span>
              </button>
              <button
                className={`nav-btn ${currentView === 'orders' ? 'active' : ''}`}
                onClick={() => setCurrentView('orders')}
              >
                <span className="nav-icon">📦</span>
                <span>Orders</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          {currentView === 'products' && (
            <Products addToCart={addToCart} cart={cart} />
          )}
          {currentView === 'cart' && (
            <Cart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              getTotalAmount={getTotalAmount}
              onCheckout={() => setCurrentView('checkout')}
              onContinueShopping={() => setCurrentView('products')}
            />
          )}
          {currentView === 'checkout' && (
            <Checkout
              cart={cart}
              getTotalAmount={getTotalAmount}
              clearCart={clearCart}
              onSuccess={() => {
                setCurrentView('orders');
                clearCart();
              }}
              onCancel={() => setCurrentView('cart')}
            />
          )}
          {currentView === 'orders' && (
            <Orders />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 TechStore - Microservices E-Commerce Platform</p>
          <p className="footer-tech">Built with React, Spring Boot & RabbitMQ</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
