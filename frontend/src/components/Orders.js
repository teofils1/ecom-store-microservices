import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  FiPackage, 
  FiCheckCircle, 
  FiClock, 
  FiTruck, 
  FiAlertCircle, 
  FiBox,
  FiCalendar,
  FiCreditCard,
  FiXCircle
} from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.email) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user || !user.email) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:8082/api/orders/customer/${user.email}`);
      setOrders(response.data);
      if (response.data.length === 0) {
        setError('No orders found. Start shopping to create your first order!');
      }
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'PENDING': <FiClock size={18} />,
      'CONFIRMED': <FiCheckCircle size={18} />,
      'PAID': <FiCreditCard size={18} />,
      'SHIPPED': <FiTruck size={18} />,
      'DELIVERED': <FiCheckCircle size={18} />,
      'CANCELLED': <FiXCircle size={18} />
    };
    return iconMap[status] || <FiPackage size={18} />;
  };

  const getPaymentMethodIcon = (method) => {
    const iconMap = {
      'CREDIT_CARD': <FiCreditCard size={24} />,
      'PAYPAL': <FiCreditCard size={24} />,
      'BANK_TRANSFER': <FiCreditCard size={24} />,
      'CASH_ON_DELIVERY': <FiPackage size={24} />
    };
    return iconMap[method] || <FiCreditCard size={24} />;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="order-list">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '10px' }}>My Orders</h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Viewing orders for: <strong>{user?.email}</strong>
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error">
          <FiAlertCircle className="error-icon" size={48} />
          <p>{error}</p>
          <button 
            onClick={fetchOrders}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <FiPackage className="empty-icon" size={64} />
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Start shopping to create your first order!</p>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <>
          <div style={{ marginBottom: '20px', color: '#6b7280' }}>
            Found <strong style={{ color: '#1f2937' }}>{orders.length}</strong> order{orders.length !== 1 ? 's' : ''}
          </div>

          {orders.map(order => (
            <div key={order.id} className="order-card">
              {/* Order Header */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.5rem', color: '#1f2937', margin: 0 }}>
                      Order #{order.id}
                    </h3>
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiCalendar size={14} /> Placed on: {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '20px',
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '10px'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Customer
                  </h4>
                  <p style={{ margin: '4px 0', color: '#1f2937' }}>
                    <strong>{order.customerName}</strong>
                  </p>
                  <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>
                    {order.customerEmail}
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Shipping Address
                  </h4>
                  <p style={{ margin: '4px 0', color: '#1f2937', whiteSpace: 'pre-line', fontSize: '14px' }}>
                    {order.shippingAddress}
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Payment Method
                  </h4>
                  <p style={{ margin: '4px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getPaymentMethodIcon(order.paymentMethod)}
                    <span>{order.paymentMethod.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 style={{ fontSize: '1.1rem', color: '#1f2937', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiBox size={20} /> Order Items
                </h4>
                <div style={{ border: '2px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        borderBottom: index < order.items.length - 1 ? '1px solid #e5e7eb' : 'none',
                        background: index % 2 === 0 ? 'white' : '#f9fafb'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: '#1f2937', fontWeight: '600' }}>
                          {item.productName}
                        </p>
                        <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, color: '#667eea', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '2px solid #667eea',
                textAlign: 'right'
              }}>
                <div style={{ display: 'inline-block', textAlign: 'left' }}>
                  <div style={{ marginBottom: '8px', color: '#6b7280' }}>
                    <span style={{ marginRight: '20px' }}>Subtotal:</span>
                    <span style={{ fontWeight: '600' }}>${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ marginBottom: '8px', color: '#6b7280' }}>
                    <span style={{ marginRight: '20px' }}>Tax (10%):</span>
                    <span style={{ fontWeight: '600' }}>${(order.totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                  <div style={{ marginBottom: '8px', color: '#6b7280' }}>
                    <span style={{ marginRight: '20px' }}>Shipping:</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>
                      {order.totalAmount > 100 ? 'FREE' : '$10.00'}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', color: '#1f2937', fontWeight: 'bold', marginTop: '10px' }}>
                    <span style={{ marginRight: '20px' }}>Total:</span>
                    <span style={{ color: '#667eea' }}>
                      ${(order.totalAmount * 1.1 + (order.totalAmount > 100 ? 0 : 10)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Orders;
