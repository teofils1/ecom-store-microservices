import React, { useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const fetchOrders = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await axios.get(`http://localhost:8082/api/orders/customer/${email}`);
      setOrders(response.data);
      if (response.data.length === 0) {
        setError('No orders found for this email address.');
      }
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchOrders();
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': '⏳',
      'CONFIRMED': '✓',
      'PAID': '💳',
      'SHIPPED': '📦',
      'DELIVERED': '✅',
      'CANCELLED': '❌'
    };
    return icons[status] || '📋';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'CREDIT_CARD': '💳',
      'PAYPAL': '🅿️',
      'BANK_TRANSFER': '🏦',
      'CASH_ON_DELIVERY': '💵'
    };
    return icons[method] || '💳';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="order-list">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '10px' }}>Order History</h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Track and view your orders</p>
      </div>

      {/* Search Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '40px',
        color: 'white'
      }}>
        <label style={{ display: 'block', marginBottom: '15px', fontSize: '1.1rem', fontWeight: '600' }}>
          🔍 Enter your email to view orders:
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="your@email.com"
            style={{
              flex: 1,
              padding: '14px 20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '25px',
              fontSize: '16px',
              background: 'rgba(255,255,255,0.9)',
              color: '#1f2937'
            }}
          />
          <button
            onClick={fetchOrders}
            disabled={loading}
            style={{
              padding: '14px 32px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '🔄 Searching...' : '🔎 Search Orders'}
          </button>
        </div>
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
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && searched && (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No Orders Found</h3>
          <p>We couldn't find any orders associated with this email address.</p>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '10px' }}>
            Make sure you're using the email address you used during checkout.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !error && orders.length === 0 && !searched && (
        <div className="empty-state">
          <span className="empty-icon">🛍️</span>
          <h3>Track Your Orders</h3>
          <p>Enter your email address above to view your order history</p>
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
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                    📅 Placed on: {formatDate(order.createdAt)}
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
                    <span style={{ fontSize: '1.5rem' }}>{getPaymentMethodIcon(order.paymentMethod)}</span>
                    <span>{order.paymentMethod.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 style={{ fontSize: '1.1rem', color: '#1f2937', marginBottom: '15px' }}>
                  📦 Order Items
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
