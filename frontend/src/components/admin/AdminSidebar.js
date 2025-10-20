import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiPieChart, FiUsers, FiPackage, FiHome, FiLogOut, FiShoppingBag } from 'react-icons/fi';

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
          <FiPieChart className="icon" size={20} />
          Dashboard
        </Link>
        
        <Link 
          to="/admin/users" 
          className={isActive('/admin/users') ? 'nav-item active' : 'nav-item'}
        >
          <FiUsers className="icon" size={20} />
          Users
        </Link>
        
        <Link 
          to="/admin/orders" 
          className={isActive('/admin/orders') ? 'nav-item active' : 'nav-item'}
        >
          <FiPackage className="icon" size={20} />
          Orders
        </Link>

        <Link 
          to="/admin/products" 
          className={isActive('/admin/products') ? 'nav-item active' : 'nav-item'}
        >
          <FiShoppingBag className="icon" size={20} />
          Products
        </Link>

        <Link to="/" className="nav-item">
          <FiHome className="icon" size={20} />
          Back to Store
        </Link>

        <button onClick={logout} className="nav-item logout-btn">
          <FiLogOut className="icon" size={20} />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
