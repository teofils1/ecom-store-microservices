import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FiShoppingCart, 
  FiPackage, 
  FiShoppingBag, 
  FiUser, 
  FiLogOut, 
  FiLogIn, 
  FiUserPlus, 
  FiSettings 
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ cartCount = 0, currentView, setCurrentView }) => {
  const { user, logout, isAdmin } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <FiShoppingBag className="brand-icon" />
          <span className="brand-text">E-Commerce Store</span>
        </Link>
      </div>

      <div className="navbar-menu">
        {currentView && setCurrentView && (
          <>
            <button
              className={currentView === 'products' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('products')}
            >
              <FiPackage className="nav-icon" />
              <span>Products</span>
            </button>
            <button
              className={currentView === 'cart' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('cart')}
            >
              <FiShoppingCart className="nav-icon" />
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button
              className={currentView === 'orders' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentView('orders')}
            >
              <FiShoppingBag className="nav-icon" />
              <span>My Orders</span>
            </button>
          </>
        )}

        {user ? (
          <div className="user-menu">
            <span className="user-name">
              <FiUser className="user-icon" />
              {user.username}
            </span>
            {isAdmin() && (
              <Link to="/admin" className="nav-btn admin-btn">
                <FiSettings className="nav-icon" />
                <span>Admin Panel</span>
              </Link>
            )}
            <button onClick={logout} className="nav-btn logout-btn">
              <FiLogOut className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="nav-btn">
              <FiLogIn className="nav-icon" />
              <span>Login</span>
            </Link>
            <Link to="/register" className="nav-btn register-btn">
              <FiUserPlus className="nav-icon" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

