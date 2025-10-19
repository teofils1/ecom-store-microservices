package com.ecommerce.paymentservice.processor.impl;

import com.ecommerce.paymentservice.processor.PaymentProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
@Slf4j
public class CashOnDeliveryProcessor implements PaymentProcessor {
    
    @Override
    public String processPayment(BigDecimal amount, Long orderId, String paymentDetails) {
        log.info("Processing cash on delivery for order: {}, amount: {}", orderId, amount);
        
        // COD requires no immediate payment processing
        String transactionId = "COD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("Cash on delivery order created. Reference ID: {}", transactionId);
        
        return transactionId;
    }
    
    @Override
    public boolean validatePaymentDetails(String paymentDetails) {
        // COD doesn't require specific payment details
        return true;
    }
    
    @Override
    public String getPaymentMethodName() {
        return "CASH_ON_DELIVERY";
    }
}
