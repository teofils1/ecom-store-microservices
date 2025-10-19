package com.ecommerce.paymentservice.processor.impl;

import com.ecommerce.paymentservice.processor.PaymentProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
@Slf4j
public class PayPalProcessor implements PaymentProcessor {
    
    @Override
    public String processPayment(BigDecimal amount, Long orderId, String paymentDetails) {
        log.info("Processing PayPal payment for order: {}, amount: {}", orderId, amount);
        
        // Simulate PayPal API processing
        try {
            Thread.sleep(800);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String transactionId = "PP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("PayPal payment processed successfully. Transaction ID: {}", transactionId);
        
        return transactionId;
    }
    
    @Override
    public boolean validatePaymentDetails(String paymentDetails) {
        // Simple email validation for PayPal
        return paymentDetails != null && paymentDetails.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
    
    @Override
    public String getPaymentMethodName() {
        return "PAYPAL";
    }
}
