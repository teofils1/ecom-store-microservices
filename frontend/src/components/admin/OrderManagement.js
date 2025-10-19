import React, { useState, useEffect } from 'react';
import { orderServiceAxios } from '../../utils/axiosConfig';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderServiceAxios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ffa500',
      CONFIRMED: '#4169e1',
      SHIPPED: '#1e90ff',
      DELIVERED: '#32cd32',
      CANCELLED: '#dc143c'
    };
    return colors[status] || '#666';
  };

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Order Management</h1>
        <p>Total Orders: {orders.length}</p>
      </div>

      <div className="filter-bar">
        <label>Filter by Status:</label>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customerName || 'N/A'}</td>
                <td>{order.items?.length || 0} items</td>
                <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                <td>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`payment-badge ${order.paymentStatus?.toLowerCase()}`}>
                    {order.paymentStatus || 'PENDING'}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-data">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
