import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Checkout = ({ cart, getTotalAmount, clearCart, onSuccess, onCancel }) => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerName: '',
    shippingAddress: '',
    paymentMethod: 'CREDIT_CARD',
    paymentDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerEmail: user.email,
        customerName: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getSubtotal = () => getTotalAmount();
  const getTax = () => getTotalAmount() * 0.1;
  const getShipping = () => getTotalAmount() > 100 ? 0 : 10;
  const getFinalTotal = () => getSubtotal() + getTax() + getShipping();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create order
      const orderData = {
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const orderResponse = await axios.post('http://localhost:8082/api/orders', orderData);
      const newOrderId = orderResponse.data.id;
      setOrderId(newOrderId);

      // Process payment
      const paymentData = {
        orderId: newOrderId,
        amount: getFinalTotal(),
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentDetails || '1234567890123456' // Default for demo
      };

      const paymentResponse = await axios.post('http://localhost:8083/api/payments/process', paymentData);

      if (paymentResponse.data.status === 'COMPLETED') {
        // Update order with payment info
        await axios.put(`http://localhost:8082/api/orders/${newOrderId}/payment`, {
          paymentId: paymentResponse.data.id
        });

        setSuccess(true);
        setTimeout(() => {
          clearCart();
          onSuccess();
        }, 3000);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
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

  if (success) {
    return (
      <div className="checkout-container">
        <div className="success">
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
          <h2>Order Placed Successfully!</h2>
          <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>
            Order ID: <strong>#{orderId}</strong>
          </p>
          <p>Thank you for your purchase! Check your email for order confirmation.</p>
          <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8 }}>
            Redirecting to orders page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#1f2937' }}>Checkout</h2>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>Complete your purchase</p>

      {error && (
        <div className="error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Customer Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1f2937' }}>
                📧 Contact Information
              </h3>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#6b7280', fontSize: '12px' }}>Using your account email</small>
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Shipping Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1f2937' }}>
                📦 Shipping Address
              </h3>
              
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows="3"
                  placeholder="123 Main St, Apt 4B&#10;New York, NY 10001"
                  required
                />
              </div>
            </div>

            {/* Payment Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1f2937' }}>
                💳 Payment Method
              </h3>
              
              <div className="form-group">
                <label>Select Payment Method *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'].map(method => (
                    <label
                      key={method}
                      style={{
                        padding: '15px',
                        border: formData.paymentMethod === method ? '2px solid #667eea' : '2px solid #e5e7eb',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s',
                        background: formData.paymentMethod === method ? '#f3f4f6' : 'white'
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <div style={{ fontSize: '2rem', marginBottom: '5px' }}>
                        {getPaymentMethodIcon(method)}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>
                        {method.replace('_', ' ')}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === 'CREDIT_CARD' && (
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="paymentDetails"
                    value={formData.paymentDetails}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                  />
                  <small style={{ color: '#6b7280', fontSize: '13px' }}>
                    Demo: Use any 16-digit number
                  </small>
                </div>
              )}

              {formData.paymentMethod === 'PAYPAL' && (
                <div className="form-group">
                  <label>PayPal Email</label>
                  <input
                    type="email"
                    name="paymentDetails"
                    value={formData.paymentDetails}
                    onChange={handleChange}
                    placeholder="your.paypal@email.com"
                  />
                </div>
              )}

              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <div className="form-group">
                  <label>Bank Account Number</label>
                  <input
                    type="text"
                    name="paymentDetails"
                    value={formData.paymentDetails}
                    onChange={handleChange}
                    placeholder="1234567890"
                  />
                </div>
              )}

              {formData.paymentMethod === 'CASH_ON_DELIVERY' && (
                <div style={{ 
                  background: '#fef3c7',
                  padding: '15px',
                  borderRadius: '10px',
                  marginTop: '10px',
                  fontSize: '14px',
                  color: '#92400e'
                }}>
                  💡 Pay in cash when your order is delivered
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                ← Back to Cart
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? (
                  <span>Processing... ⏳</span>
                ) : (
                  <span>Place Order 🎉</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '10px' }}>
                Items ({cart.length})
              </h4>
              {cart.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${getTax().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span className={getShipping() === 0 ? 'free-shipping' : ''}>
                {getShipping() === 0 ? 'FREE' : `$${getShipping().toFixed(2)}`}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total:</span>
              <span className="total-amount">${getFinalTotal().toFixed(2)}</span>
            </div>

            <div className="security-badges" style={{ marginTop: '20px' }}>
              <span className="badge">🔒 Secure SSL Encryption</span>
              <span className="badge">✓ 100% Money Back Guarantee</span>
              <span className="badge">📞 24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
