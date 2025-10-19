package com.ecommerce.paymentservice.service;

import com.ecommerce.paymentservice.dto.PaymentDTO;
import com.ecommerce.paymentservice.dto.ProcessPaymentRequest;
import com.ecommerce.paymentservice.factory.PaymentProcessorFactory;
import com.ecommerce.paymentservice.model.Payment;
import com.ecommerce.paymentservice.model.PaymentMethod;
import com.ecommerce.paymentservice.model.PaymentStatus;
import com.ecommerce.paymentservice.processor.PaymentProcessor;
import com.ecommerce.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final PaymentProcessorFactory processorFactory;
    
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return convertToDTO(payment);
    }
    
    public PaymentDTO getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));
        return convertToDTO(payment);
    }
    
    public PaymentDTO processPayment(ProcessPaymentRequest request) {
        log.info("Processing payment for order: {}", request.getOrderId());
        
        // Create payment record
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount());
        payment.setMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        payment.setStatus(PaymentStatus.PROCESSING);
        
        // Save initial payment
        Payment savedPayment = paymentRepository.save(payment);
        
        try {
            // Use Factory Pattern to get appropriate processor
            PaymentProcessor processor = processorFactory.createProcessor(request.getPaymentMethod());
            
            // Validate payment details
            if (!processor.validatePaymentDetails(request.getPaymentDetails())) {
                throw new RuntimeException("Invalid payment details");
            }
            
            // Process payment
            String transactionId = processor.processPayment(
                    request.getAmount(),
                    request.getOrderId(),
                    request.getPaymentDetails()
            );
            
            // Update payment with transaction details
            savedPayment.setTransactionId(transactionId);
            savedPayment.setStatus(PaymentStatus.COMPLETED);
            
            // Extract card last 4 digits if credit card
            if (payment.getMethod() == PaymentMethod.CREDIT_CARD && request.getPaymentDetails() != null) {
                String lastFour = request.getPaymentDetails().substring(
                        Math.max(0, request.getPaymentDetails().length() - 4)
                );
                savedPayment.setCardLastFourDigits(lastFour);
            }
            
            paymentRepository.save(savedPayment);
            log.info("Payment processed successfully. Transaction ID: {}", transactionId);
            
        } catch (Exception e) {
            log.error("Payment processing failed: {}", e.getMessage());
            savedPayment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(savedPayment);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }
        
        return convertToDTO(savedPayment);
    }
    
    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setOrderId(payment.getOrderId());
        dto.setAmount(payment.getAmount());
        dto.setMethod(payment.getMethod());
        dto.setStatus(payment.getStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setCardLastFourDigits(payment.getCardLastFourDigits());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());
        return dto;
    }
}
