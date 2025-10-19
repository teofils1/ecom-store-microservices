package com.ecommerce.notificationservice.listener;

import com.ecommerce.notificationservice.event.OrderEvent;
import com.ecommerce.notificationservice.model.NotificationType;
import com.ecommerce.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern Implementation via RabbitMQ
 * This class observes order events and sends notifications
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {
    
    private final NotificationService notificationService;
    
    @RabbitListener(queues = "order.created.queue")
    public void handleOrderCreated(OrderEvent event) {
        log.info("Received ORDER_CREATED event for order: {}", event.getOrderId());
        
        String subject = "Order Created - Order #" + event.getOrderId();
        String message = String.format(
                "Dear %s,\n\nYour order #%d has been created successfully.\n\n" +
                        "Order Total: $%.2f\n" +
                        "Shipping Address: %s\n\n" +
                        "Thank you for shopping with us!",
                event.getCustomerName(),
                event.getOrderId(),
                event.getTotalAmount(),
                event.getShippingAddress()
        );
        
        notificationService.createAndSendNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                NotificationType.ORDER_CREATED,
                subject,
                message
        );
    }
    
    @RabbitListener(queues = "order.confirmed.queue")
    public void handleOrderConfirmed(OrderEvent event) {
        log.info("Received ORDER_CONFIRMED event for order: {}", event.getOrderId());
        
        String subject = "Order Confirmed - Order #" + event.getOrderId();
        String message = String.format(
                "Dear %s,\n\nYour order #%d has been confirmed.\n\n" +
                        "We are processing your order and will notify you once it's shipped.\n\n" +
                        "Order Total: $%.2f",
                event.getCustomerName(),
                event.getOrderId(),
                event.getTotalAmount()
        );
        
        notificationService.createAndSendNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                NotificationType.ORDER_CONFIRMED,
                subject,
                message
        );
    }
    
    @RabbitListener(queues = "order.paid.queue")
    public void handleOrderPaid(OrderEvent event) {
        log.info("Received ORDER_PAID event for order: {}", event.getOrderId());
        
        String subject = "Payment Received - Order #" + event.getOrderId();
        String message = String.format(
                "Dear %s,\n\nWe have received your payment for order #%d.\n\n" +
                        "Amount Paid: $%.2f\n" +
                        "Payment Method: %s\n\n" +
                        "Your order will be shipped soon!",
                event.getCustomerName(),
                event.getOrderId(),
                event.getTotalAmount(),
                event.getPaymentMethod()
        );
        
        notificationService.createAndSendNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                NotificationType.ORDER_PAID,
                subject,
                message
        );
    }
    
    @RabbitListener(queues = "order.shipped.queue")
    public void handleOrderShipped(OrderEvent event) {
        log.info("Received ORDER_SHIPPED event for order: {}", event.getOrderId());
        
        String subject = "Order Shipped - Order #" + event.getOrderId();
        String message = String.format(
                "Dear %s,\n\nGreat news! Your order #%d has been shipped.\n\n" +
                        "Shipping Address: %s\n\n" +
                        "Your order will arrive soon. Thank you for your patience!",
                event.getCustomerName(),
                event.getOrderId(),
                event.getShippingAddress()
        );
        
        notificationService.createAndSendNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                NotificationType.ORDER_SHIPPED,
                subject,
                message
        );
    }
}
