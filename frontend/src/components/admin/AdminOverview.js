import React, { useState, useEffect } from 'react';
import axiosInstance, { orderServiceAxios } from '../../utils/axiosConfig';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    totalVendors: 0
  });
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userResponse, orderResponse] = await Promise.all([
        axiosInstance.get('/api/admin/stats'),
        orderServiceAxios.get('/api/orders').catch(() => ({ data: [] }))
      ]);

      setStats(userResponse.data);

      if (Array.isArray(orderResponse.data)) {
        const orders = orderResponse.data;
        setOrderStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'PENDING').length,
          completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
          totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-overview">
      <h1>Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-details">
            <h3>Customers</h3>
            <p className="stat-number">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-number">{orderStats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <h3>Revenue</h3>
            <p className="stat-number">${orderStats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-details">
            <h3>Pending Orders</h3>
            <p className="stat-number">{orderStats.pendingOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <h3>Completed Orders</h3>
            <p className="stat-number">{orderStats.completedOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔑</div>
          <div className="stat-details">
            <h3>Admins</h3>
            <p className="stat-number">{stats.totalAdmins}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-details">
            <h3>Vendors</h3>
            <p className="stat-number">{stats.totalVendors}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => window.location.href = '/admin/users'}>
            Manage Users
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/orders'}>
            View Orders
          </button>
          <button className="action-btn" onClick={fetchStats}>
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
