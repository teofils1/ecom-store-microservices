package com.ecommerce.notificationservice.service;

import com.ecommerce.notificationservice.model.Notification;
import com.ecommerce.notificationservice.model.NotificationStatus;
import com.ecommerce.notificationservice.model.NotificationType;
import com.ecommerce.notificationservice.repository.NotificationRepository;
import com.ecommerce.notificationservice.util.EmailTemplateBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
    
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
    }
    
    public List<Notification> getNotificationsByOrderId(Long orderId) {
        return notificationRepository.findByOrderId(orderId);
    }
    
    public List<Notification> getNotificationsByCustomerEmail(String email) {
        return notificationRepository.findByCustomerEmail(email);
    }
    
    /**
     * Create and send notification with plain text message
     */
    public void createAndSendNotification(
            Long orderId,
            String customerEmail,
            NotificationType type,
            String subject,
            String message) {
        
        Notification notification = new Notification();
        notification.setOrderId(orderId);
        notification.setCustomerEmail(customerEmail);
        notification.setType(type);
        notification.setSubject(subject);
        notification.setMessage(message);
        notification.setStatus(NotificationStatus.PENDING);
        
        notificationRepository.save(notification);
        
        // Send notification via email
        boolean sent = emailService.sendSimpleEmail(customerEmail, subject, message);
        
        if (sent) {
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            log.info("Notification sent successfully: {} to {}", type, customerEmail);
        } else {
            notification.setStatus(NotificationStatus.FAILED);
            log.error("Failed to send notification: {} to {}", type, customerEmail);
        }
        
        notificationRepository.save(notification);
    }
    
    /**
     * Create and send HTML email notification for ORDER_CREATED
     */
    public void sendOrderCreatedNotification(Long orderId, String customerEmail, 
                                            String customerName, BigDecimal totalAmount, 
                                            String shippingAddress) {
        String subject = "Order Created - Order #" + orderId;
        String htmlContent = EmailTemplateBuilder.buildOrderCreatedEmail(
                customerName, orderId, totalAmount, shippingAddress);
        
        sendHtmlNotification(orderId, customerEmail, NotificationType.ORDER_CREATED, 
                           subject, htmlContent);
    }
    
    /**
     * Create and send HTML email notification for ORDER_CONFIRMED
     */
    public void sendOrderConfirmedNotification(Long orderId, String customerEmail,
                                              String customerName, BigDecimal totalAmount) {
        String subject = "Order Confirmed - Order #" + orderId;
        String htmlContent = EmailTemplateBuilder.buildOrderConfirmedEmail(
                customerName, orderId, totalAmount);
        
        sendHtmlNotification(orderId, customerEmail, NotificationType.ORDER_CONFIRMED,
                           subject, htmlContent);
    }
    
    /**
     * Create and send HTML email notification for ORDER_PAID
     */
    public void sendOrderPaidNotification(Long orderId, String customerEmail,
                                         String customerName, BigDecimal totalAmount,
                                         String paymentMethod) {
        String subject = "Payment Received - Order #" + orderId;
        String htmlContent = EmailTemplateBuilder.buildOrderPaidEmail(
                customerName, orderId, totalAmount, paymentMethod);
        
        sendHtmlNotification(orderId, customerEmail, NotificationType.ORDER_PAID,
                           subject, htmlContent);
    }
    
    /**
     * Create and send HTML email notification for ORDER_SHIPPED
     */
    public void sendOrderShippedNotification(Long orderId, String customerEmail,
                                            String customerName, String shippingAddress) {
        String subject = "Order Shipped - Order #" + orderId;
        String htmlContent = EmailTemplateBuilder.buildOrderShippedEmail(
                customerName, orderId, shippingAddress);
        
        sendHtmlNotification(orderId, customerEmail, NotificationType.ORDER_SHIPPED,
                           subject, htmlContent);
    }
    
    /**
     * Create and send HTML email notification for ORDER_DELIVERED
     */
    public void sendOrderDeliveredNotification(Long orderId, String customerEmail,
                                              String customerName) {
        String subject = "Order Delivered - Order #" + orderId;
        String htmlContent = EmailTemplateBuilder.buildOrderDeliveredEmail(
                customerName, orderId);
        
        sendHtmlNotification(orderId, customerEmail, NotificationType.ORDER_DELIVERED,
                           subject, htmlContent);
    }
    
    /**
     * Helper method to send HTML email notifications
     */
    private void sendHtmlNotification(Long orderId, String customerEmail, 
                                     NotificationType type, String subject, 
                                     String htmlContent) {
        Notification notification = new Notification();
        notification.setOrderId(orderId);
        notification.setCustomerEmail(customerEmail);
        notification.setType(type);
        notification.setSubject(subject);
        notification.setMessage(htmlContent);
        notification.setStatus(NotificationStatus.PENDING);
        
        notificationRepository.save(notification);
        
        // Send HTML email
        boolean sent = emailService.sendHtmlEmail(customerEmail, subject, htmlContent);
        
        if (sent) {
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            log.info("HTML notification sent successfully: {} to {}", type, customerEmail);
        } else {
            notification.setStatus(NotificationStatus.FAILED);
            log.error("Failed to send HTML notification: {} to {}", type, customerEmail);
        }
        
        notificationRepository.save(notification);
    }
}
