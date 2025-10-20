import React, { useState, useEffect } from 'react';
import { orderServiceAxios } from '../../utils/axiosConfig';
import { FiPackage, FiFilter, FiEdit } from 'react-icons/fi';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

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
      PAYMENT_PROCESSING: '#9370db',
      PAID: '#20b2aa',
      PROCESSING: '#ff8c00',
      SHIPPED: '#1e90ff',
      DELIVERED: '#32cd32',
      CANCELLED: '#dc143c',
      FAILED: '#8b0000'
    };
    return colors[status] || '#666';
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await orderServiceAxios.put(`/api/orders/${selectedOrder.id}/status`, {
        status: newStatus
      });
      setShowModal(false);
      fetchOrders(); // Refresh the orders list
      alert(`Order #${selectedOrder.id} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
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
        <h1><FiPackage size={32} /> Order Management</h1>
        <p>Total Orders: {orders.length}</p>
      </div>

      <div className="filter-bar">
        <label><FiFilter size={18} /> Filter by Status:</label>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PAID">Paid</option>
          <option value="PROCESSING">Processing</option>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  <div>{order.customerName || 'N/A'}</div>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>{order.customerEmail}</div>
                </td>
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
                  <span className={`payment-badge ${order.paymentId ? 'paid' : 'pending'}`}>
                    {order.paymentId ? 'PAID' : 'PENDING'}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <button 
                    className="btn-action"
                    onClick={() => openStatusModal(order)}
                    title="Update Status"
                  >
                    <FiEdit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-data">No orders found</div>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Order Status</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-info">
                <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Current Status:</strong> <span style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span></p>
              </div>

              <div className="form-group">
                <label>New Status:</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="status-select"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PAYMENT_PROCESSING">Payment Processing</option>
                  <option value="PAID">Paid</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              {newStatus === 'DELIVERED' && (
                <div className="alert alert-info">
                  ℹ️ Marking as DELIVERED will automatically reduce product stock quantities.
                </div>
              )}

              <div className="order-items">
                <h4>Order Items:</h4>
                <ul>
                  {selectedOrder.items?.map((item, index) => (
                    <li key={index}>
                      {item.productName} - Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleStatusUpdate}>
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .order-management {
          padding: 20px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .page-header h1 {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #333;
          margin: 0;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .filter-bar label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }

        .table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }

        .data-table td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
        }

        .data-table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .payment-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .payment-badge.paid {
          background: #d4edda;
          color: #155724;
        }

        .payment-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .btn-action {
          padding: 6px 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
        }

        .btn-action:hover {
          background: #0056b3;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #dee2e6;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #6c757d;
          line-height: 1;
        }

        .modal-close:hover {
          color: #000;
        }

        .modal-body {
          padding: 20px;
        }

        .order-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .order-info p {
          margin: 8px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #495057;
        }

        .status-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }

        .alert {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .alert-info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        .order-items {
          margin-top: 20px;
        }

        .order-items h4 {
          margin-bottom: 10px;
          color: #495057;
        }

        .order-items ul {
          list-style: none;
          padding: 0;
        }

        .order-items li {
          padding: 8px;
          background: #f8f9fa;
          margin-bottom: 5px;
          border-radius: 4px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #dee2e6;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;
