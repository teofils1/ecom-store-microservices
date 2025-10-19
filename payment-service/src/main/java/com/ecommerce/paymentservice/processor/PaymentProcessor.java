package com.ecommerce.paymentservice.processor;

import java.math.BigDecimal;

/**
 * Payment Processor Interface - Strategy Pattern
 * All payment processors must implement this interface
 */
public interface PaymentProcessor {
    
    /**
     * Process a payment transaction
     * @param amount The amount to charge
     * @param orderId The order ID
     * @param paymentDetails Additional payment details (card number, PayPal email, etc.)
     * @return Transaction ID if successful
     */
    String processPayment(BigDecimal amount, Long orderId, String paymentDetails);
    
    /**
     * Validate payment details before processing
     * @param paymentDetails The payment details to validate
     * @return true if valid, false otherwise
     */
    boolean validatePaymentDetails(String paymentDetails);
    
    /**
     * Get the payment method name
     * @return Payment method name
     */
    String getPaymentMethodName();
}
