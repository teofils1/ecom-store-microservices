import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p className="admin-user">{user?.username}</p>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/admin" 
          className={isActive('/admin') ? 'nav-item active' : 'nav-item'}
        >
          <span className="icon">📊</span>
          Dashboard
        </Link>
        
        <Link 
          to="/admin/users" 
          className={isActive('/admin/users') ? 'nav-item active' : 'nav-item'}
        >
          <span className="icon">👥</span>
          Users
        </Link>
        
        <Link 
          to="/admin/orders" 
          className={isActive('/admin/orders') ? 'nav-item active' : 'nav-item'}
        >
          <span className="icon">📦</span>
          Orders
        </Link>

        <Link to="/" className="nav-item">
          <span className="icon">🏪</span>
          Back to Store
        </Link>

        <button onClick={logout} className="nav-item logout-btn">
          <span className="icon">🚪</span>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
