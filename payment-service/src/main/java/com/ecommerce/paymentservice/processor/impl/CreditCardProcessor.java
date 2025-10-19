package com.ecommerce.paymentservice.processor.impl;

import com.ecommerce.paymentservice.processor.PaymentProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
@Slf4j
public class CreditCardProcessor implements PaymentProcessor {
    
    @Override
    public String processPayment(BigDecimal amount, Long orderId, String paymentDetails) {
        log.info("Processing credit card payment for order: {}, amount: {}", orderId, amount);
        
        // Simulate credit card processing
        try {
            Thread.sleep(1000); // Simulate external API call
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Generate transaction ID
        String transactionId = "CC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("Credit card payment processed successfully. Transaction ID: {}", transactionId);
        
        return transactionId;
    }
    
    @Override
    public boolean validatePaymentDetails(String paymentDetails) {
        // Simple validation - check if it looks like a credit card number (min 10 digits for testing)
        return paymentDetails != null && paymentDetails.matches("\\d{10,19}");
    }
    
    @Override
    public String getPaymentMethodName() {
        return "CREDIT_CARD";
    }
}
