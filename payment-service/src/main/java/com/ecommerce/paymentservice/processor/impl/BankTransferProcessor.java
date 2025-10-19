package com.ecommerce.paymentservice.processor.impl;

import com.ecommerce.paymentservice.processor.PaymentProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
@Slf4j
public class BankTransferProcessor implements PaymentProcessor {
    
    @Override
    public String processPayment(BigDecimal amount, Long orderId, String paymentDetails) {
        log.info("Processing bank transfer for order: {}, amount: {}", orderId, amount);
        
        // Simulate bank transfer processing
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String transactionId = "BT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("Bank transfer processed successfully. Transaction ID: {}", transactionId);
        
        return transactionId;
    }
    
    @Override
    public boolean validatePaymentDetails(String paymentDetails) {
        // Simple validation for bank account number
        return paymentDetails != null && paymentDetails.matches("\\d{10,20}");
    }
    
    @Override
    public String getPaymentMethodName() {
        return "BANK_TRANSFER";
    }
}
