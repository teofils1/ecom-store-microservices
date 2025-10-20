import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Checkout.css';
import { 
  FiCreditCard, 
  FiPackage, 
  FiMail, 
  FiArrowLeft, 
  FiLock, 
  FiCheck, 
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiInfo,
  FiMapPin,
  FiUser
} from 'react-icons/fi';

const Checkout = ({ cart, getTotalAmount, clearCart, onSuccess, onCancel }) => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerName: '',
    shippingAddress: '',
    city: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'CREDIT_CARD',
    paymentDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerEmail: user.email || '',
        customerName: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.customerName.trim()) {
      errors.customerName = 'Full name is required';
    }
    
    if (!formData.shippingAddress.trim()) {
      errors.shippingAddress = 'Shipping address is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      errors.zipCode = 'Invalid ZIP code format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (formData.paymentMethod === 'CREDIT_CARD' && formData.paymentDetails) {
      if (!/^\d{16}$/.test(formData.paymentDetails.replace(/\s/g, ''))) {
        errors.paymentDetails = 'Card number must be 16 digits';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getSubtotal = () => getTotalAmount();
  const getTax = () => getTotalAmount() * 0.1;
  const getShipping = () => getTotalAmount() > 100 ? 0 : 10;
  const getFinalTotal = () => getSubtotal() + getTax() + getShipping();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before proceeding');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Combine address fields
      const fullAddress = `${formData.shippingAddress}, ${formData.city}, ${formData.zipCode}`;
      
      // Create order
      const orderData = {
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        shippingAddress: fullAddress,
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
          if (onSuccess) {
            onSuccess();
          }
        }, 2500);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    const iconMap = {
      'CREDIT_CARD': <FiCreditCard size={32} />,
      'PAYPAL': <FiCreditCard size={32} />,
      'BANK_TRANSFER': <FiCreditCard size={32} />,
      'CASH_ON_DELIVERY': <FiPackage size={32} />
    };
    return iconMap[method] || <FiCreditCard size={32} />;
  };

  if (success) {
    return (
      <div className="checkout-container">
        <div className="success" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <FiCheckCircle size={80} style={{ color: '#10b981', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Order Placed Successfully!</h2>
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            marginTop: '25px',
            border: '2px solid #a7f3d0'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '10px' }}>
              Order ID
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>
              #{orderId}
            </p>
          </div>
          <p style={{ marginTop: '25px', fontSize: '1.1rem', color: '#4b5563' }}>
            Thank you for your purchase!
          </p>
          <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>
            A confirmation email has been sent to <strong>{formData.customerEmail}</strong>
          </p>
          <div style={{ 
            marginTop: '30px', 
            padding: '15px', 
            background: '#f3f4f6', 
            borderRadius: '8px',
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            justifyContent: 'center',
            fontSize: '14px',
            color: '#4b5563'
          }}>
            <FiClock size={18} /> Redirecting to your orders...
          </div>
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
          <FiAlertCircle className="error-icon" size={24} />
          <p>{error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Customer Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiUser size={24} /> Contact Information
              </h3>
              
              <div className="form-group">
                <label>Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    disabled
                    style={{ 
                      backgroundColor: '#f3f4f6', 
                      cursor: 'not-allowed',
                      paddingLeft: '45px'
                    }}
                  />
                </div>
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  Using your account email
                </small>
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    style={{ paddingLeft: '45px' }}
                  />
                </div>
                {validationErrors.customerName && (
                  <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiAlertCircle size={14} /> {validationErrors.customerName}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <FiPhone style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    style={{ paddingLeft: '45px' }}
                  />
                </div>
                {validationErrors.phone && (
                  <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiAlertCircle size={14} /> {validationErrors.phone}
                  </small>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiPackage size={24} /> Shipping Address
              </h3>
              
              <div className="form-group">
                <label>Street Address *</label>
                <div style={{ position: 'relative' }}>
                  <FiMapPin style={{ position: 'absolute', left: '15px', top: '15px', color: '#9ca3af' }} size={18} />
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    rows="2"
                    placeholder="123 Main Street, Apt 4B"
                    required
                    style={{ paddingLeft: '45px' }}
                  />
                </div>
                {validationErrors.shippingAddress && (
                  <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiAlertCircle size={14} /> {validationErrors.shippingAddress}
                  </small>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    required
                  />
                  {validationErrors.city && (
                    <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FiAlertCircle size={14} /> {validationErrors.city}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                    required
                  />
                  {validationErrors.zipCode && (
                    <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FiAlertCircle size={14} /> {validationErrors.zipCode}
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiCreditCard size={24} /> Payment Method
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
                  <div style={{ position: 'relative' }}>
                    <FiCreditCard style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                    <input
                      type="text"
                      name="paymentDetails"
                      value={formData.paymentDetails}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      style={{ paddingLeft: '45px' }}
                    />
                  </div>
                  {validationErrors.paymentDetails && (
                    <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FiAlertCircle size={14} /> {validationErrors.paymentDetails}
                    </small>
                  )}
                  <small style={{ color: '#6b7280', fontSize: '13px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiInfo size={14} /> Demo: Use any 16-digit number
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
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FiInfo size={20} /> Pay in cash when your order is delivered
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
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FiArrowLeft size={18} /> Back to Cart
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? (
                  <>
                    <FiClock size={18} /> Processing...
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={18} /> Place Order
                  </>
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

        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
