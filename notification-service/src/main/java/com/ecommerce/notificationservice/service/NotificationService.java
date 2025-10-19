package com.ecommerce.notificationservice.service;

import com.ecommerce.notificationservice.model.Notification;
import com.ecommerce.notificationservice.model.NotificationStatus;
import com.ecommerce.notificationservice.model.NotificationType;
import com.ecommerce.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
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
        
        // Simulate sending notification (email/SMS)
        boolean sent = sendNotification(notification);
        
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
    
    private boolean sendNotification(Notification notification) {
        try {
            // Simulate email/SMS sending delay
            Thread.sleep(500);
            
            // In a real application, this would integrate with:
            // - Email service (SendGrid, AWS SES, etc.)
            // - SMS service (Twilio, AWS SNS, etc.)
            log.info("=== SENDING NOTIFICATION ===");
            log.info("To: {}", notification.getCustomerEmail());
            log.info("Subject: {}", notification.getSubject());
            log.info("Message: {}", notification.getMessage());
            log.info("============================");
            
            return true;
        } catch (Exception e) {
            log.error("Error sending notification: {}", e.getMessage());
            return false;
        }
    }
}
