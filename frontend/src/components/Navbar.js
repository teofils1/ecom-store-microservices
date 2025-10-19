import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ cartCount = 0, currentView, setCurrentView }) => {
  const { user, logout, isAdmin } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🛒 E-Commerce</Link>
      </div>

      <div className="navbar-menu">
        {currentView && setCurrentView && (
          <>
            <button
              className={currentView === 'products' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('products')}
            >
              Products
            </button>
            <button
              className={currentView === 'cart' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('cart')}
            >
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button
              className={currentView === 'orders' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('orders')}
            >
              My Orders
            </button>
          </>
        )}

        {user ? (
          <div className="user-menu">
            <span className="user-name">👤 {user.username}</span>
            {isAdmin() && (
              <Link to="/admin" className="nav-btn admin-btn">
                Admin Panel
              </Link>
            )}
            <button onClick={logout} className="nav-btn logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn register-btn">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
