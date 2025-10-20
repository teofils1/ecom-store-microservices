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
        
        notificationService.sendOrderCreatedNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                event.getCustomerName(),
                event.getTotalAmount(),
                event.getShippingAddress()
        );
    }
    
    @RabbitListener(queues = "order.confirmed.queue")
    public void handleOrderConfirmed(OrderEvent event) {
        log.info("Received ORDER_CONFIRMED event for order: {}", event.getOrderId());
        
        notificationService.sendOrderConfirmedNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                event.getCustomerName(),
                event.getTotalAmount()
        );
    }
    
    @RabbitListener(queues = "order.paid.queue")
    public void handleOrderPaid(OrderEvent event) {
        log.info("Received ORDER_PAID event for order: {}", event.getOrderId());
        
        notificationService.sendOrderPaidNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                event.getCustomerName(),
                event.getTotalAmount(),
                event.getPaymentMethod()
        );
    }
    
    @RabbitListener(queues = "order.shipped.queue")
    public void handleOrderShipped(OrderEvent event) {
        log.info("Received ORDER_SHIPPED event for order: {}", event.getOrderId());
        
        notificationService.sendOrderShippedNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                event.getCustomerName(),
                event.getShippingAddress()
        );
    }
    
    @RabbitListener(queues = "order.delivered.queue")
    public void handleOrderDelivered(OrderEvent event) {
        log.info("Received ORDER_DELIVERED event for order: {}", event.getOrderId());
        
        notificationService.sendOrderDeliveredNotification(
                event.getOrderId(),
                event.getCustomerEmail(),
                event.getCustomerName()
        );
    }
}
