package com.ecommerce.paymentservice.factory;

import com.ecommerce.paymentservice.model.PaymentMethod;
import com.ecommerce.paymentservice.processor.PaymentProcessor;
import com.ecommerce.paymentservice.processor.impl.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Factory Pattern Implementation
 * Creates appropriate payment processor based on payment method
 */
@Component
@RequiredArgsConstructor
public class PaymentProcessorFactory {
    
    private final CreditCardProcessor creditCardProcessor;
    private final PayPalProcessor payPalProcessor;
    private final BankTransferProcessor bankTransferProcessor;
    private final CashOnDeliveryProcessor cashOnDeliveryProcessor;
    
    /**
     * Factory Method to create payment processor
     * @param method The payment method
     * @return Appropriate PaymentProcessor implementation
     */
    public PaymentProcessor createProcessor(PaymentMethod method) {
        return switch (method) {
            case CREDIT_CARD -> creditCardProcessor;
            case PAYPAL -> payPalProcessor;
            case BANK_TRANSFER -> bankTransferProcessor;
            case CASH_ON_DELIVERY -> cashOnDeliveryProcessor;
        };
    }
    
    /**
     * Create processor from string method name
     * @param methodName The payment method name
     * @return Appropriate PaymentProcessor implementation
     */
    public PaymentProcessor createProcessor(String methodName) {
        PaymentMethod method = PaymentMethod.valueOf(methodName.toUpperCase());
        return createProcessor(method);
    }
}
