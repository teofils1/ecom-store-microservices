package com.ecommerce.notificationservice.controller;

import com.ecommerce.notificationservice.model.Notification;
import com.ecommerce.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Notification>> getNotificationsByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(notificationService.getNotificationsByOrderId(orderId));
    }
    
    @GetMapping("/customer/{email}")
    public ResponseEntity<List<Notification>> getNotificationsByCustomer(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getNotificationsByCustomerEmail(email));
    }
}
