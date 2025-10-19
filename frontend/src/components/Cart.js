import React from 'react';

const Cart = ({ cart, updateQuantity, removeFromCart, getTotalAmount, onCheckout, onContinueShopping }) => {
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return getTotalAmount();
  };

  const getTax = () => {
    return getTotalAmount() * 0.1; // 10% tax
  };

  const getShipping = () => {
    return getTotalAmount() > 100 ? 0 : 10;
  };

  const getFinalTotal = () => {
    return getSubtotal() + getTax() + getShipping();
  };

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet!</p>
        <button onClick={onContinueShopping} className="btn-primary">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <p className="cart-summary">
          <strong>{getTotalItems()}</strong> {getTotalItems() === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items-section">
          {cart.map(item => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-image">
                <span className="item-icon">📦</span>
              </div>

              <div className="cart-item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price.toFixed(2)} each</p>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  <span className="subtotal-label">Subtotal:</span>
                  <span className="subtotal-amount">${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <span className="remove-icon">🗑️</span>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button onClick={onContinueShopping} className="continue-shopping-btn">
            ← Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} items):</span>
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

            {getTotalAmount() > 100 && (
              <div className="free-shipping-notice">
                🎉 You've qualified for free shipping!
              </div>
            )}

            {getTotalAmount() <= 100 && (
              <div className="shipping-notice">
                💡 Add ${(100 - getTotalAmount()).toFixed(2)} more for free shipping
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total:</span>
              <span className="total-amount">${getFinalTotal().toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
              <span className="btn-arrow">→</span>
            </button>

            <div className="security-badges">
              <span className="badge">🔒 Secure Checkout</span>
              <span className="badge">✓ Money Back Guarantee</span>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="promo-card">
            <h4>Have a promo code?</h4>
            <div className="promo-input-group">
              <input
                type="text"
                placeholder="Enter code"
                className="promo-input"
              />
              <button className="apply-btn">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
