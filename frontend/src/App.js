import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';

// Main content component that has access to AuthContext
function MainApp() {
  const { user } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('products');
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      const cartKey = `cart_${user.id || user.sub}`;
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart:', error);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user]);

  // Save cart to localStorage when cart changes
  useEffect(() => {
    if (user) {
      const cartKey = `cart_${user.id || user.sub}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, user]);

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
        item.id === productId ? { ...item, quantity } : item
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

  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'error');
      return;
    }
    setCurrentView('checkout');
  };

  const handleCheckoutSuccess = () => {
    setCurrentView('orders');
    showNotification('Order placed successfully!', 'success');
  };

  const handleCheckoutCancel = () => {
    setCurrentView('cart');
  };

  const MainContent = () => {
    return (
      <div className="main-content">
        <Navbar 
          cartCount={getTotalItems()} 
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        {notification && (
          <div className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        )}

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
              onCheckout={handleCheckout}
              onContinueShopping={() => setCurrentView('products')}
            />
          )}
          {currentView === 'checkout' && (
            <Checkout
              cart={cart}
              getTotalAmount={getTotalAmount}
              clearCart={clearCart}
              onSuccess={handleCheckoutSuccess}
              onCancel={handleCheckoutCancel}
            />
          )}
          {currentView === 'orders' && (
            <Orders />
          )}
        </div>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainContent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
