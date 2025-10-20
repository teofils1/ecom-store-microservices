package com.ecommerce.orderservice.service;

import com.ecommerce.orderservice.config.RabbitMQConfig;
import com.ecommerce.orderservice.dto.*;
import com.ecommerce.orderservice.event.OrderEvent;
import com.ecommerce.orderservice.model.Order;
import com.ecommerce.orderservice.model.OrderItem;
import com.ecommerce.orderservice.model.OrderStatus;
import com.ecommerce.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final RabbitTemplate rabbitTemplate;
    private final WebClient.Builder webClientBuilder;
    
    @Value("${product.service.url}")
    private String productServiceUrl;
    
    @Value("${payment.service.url}")
    private String paymentServiceUrl;
    
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return convertToDTO(order);
    }
    
    public List<OrderDTO> getOrdersByCustomerEmail(String email) {
        return orderRepository.findByCustomerEmail(email).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OrderDTO createOrder(CreateOrderRequest request) {
        // Create order
        Order order = new Order();
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerName(request.getCustomerName());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);
        
        // Add items and calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItemDTO itemDTO : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setProductId(itemDTO.getProductId());
            item.setProductName(itemDTO.getProductName());
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(itemDTO.getPrice());
            
            BigDecimal subtotal = itemDTO.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            item.setSubtotal(subtotal);
            totalAmount = totalAmount.add(subtotal);
            
            order.addItem(item);
        }
        
        order.setTotalAmount(totalAmount);
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        log.info("Order created: {}", savedOrder.getId());
        
        // Publish order created event
        publishOrderEvent(savedOrder, RabbitMQConfig.ORDER_CREATED_ROUTING_KEY);
        
        // Confirm order
        savedOrder.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(savedOrder);
        publishOrderEvent(savedOrder, RabbitMQConfig.ORDER_CONFIRMED_ROUTING_KEY);
        
        return convertToDTO(savedOrder);
    }
    
    public OrderDTO updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        OrderStatus previousStatus = order.getStatus();
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        
        // If order is being marked as DELIVERED, reduce product stock
        if (status == OrderStatus.DELIVERED && previousStatus != OrderStatus.DELIVERED) {
            updateProductStock(updatedOrder);
        }
        
        // Publish appropriate event based on status
        String routingKey = switch (status) {
            case PAID -> RabbitMQConfig.ORDER_PAID_ROUTING_KEY;
            case SHIPPED -> RabbitMQConfig.ORDER_SHIPPED_ROUTING_KEY;
            case DELIVERED -> RabbitMQConfig.ORDER_DELIVERED_ROUTING_KEY;
            default -> null;
        };
        
        if (routingKey != null) {
            publishOrderEvent(updatedOrder, routingKey);
        }
        
        return convertToDTO(updatedOrder);
    }
    
    public OrderDTO processPayment(Long orderId, Long paymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        order.setPaymentId(paymentId);
        order.setStatus(OrderStatus.PAID);
        Order updatedOrder = orderRepository.save(order);
        
        publishOrderEvent(updatedOrder, RabbitMQConfig.ORDER_PAID_ROUTING_KEY);
        
        return convertToDTO(updatedOrder);
    }
    
    private void publishOrderEvent(Order order, String routingKey) {
        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setCustomerEmail(order.getCustomerEmail());
        event.setCustomerName(order.getCustomerName());
        event.setStatus(order.getStatus().name());
        event.setTotalAmount(order.getTotalAmount());
        event.setShippingAddress(order.getShippingAddress());
        event.setPaymentMethod(order.getPaymentMethod());
        event.setTimestamp(LocalDateTime.now());
        
        List<OrderEvent.OrderItemEvent> itemEvents = order.getItems().stream()
                .map(item -> new OrderEvent.OrderItemEvent(
                        item.getProductId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());
        event.setItems(itemEvents);
        
        rabbitTemplate.convertAndSend(RabbitMQConfig.ORDER_EXCHANGE, routingKey, event);
        log.info("Published order event: {} with routing key: {}", event.getOrderId(), routingKey);
    }
    
    private void updateProductStock(Order order) {
        for (OrderItem item : order.getItems()) {
            try {
                // Call product service to update stock
                webClientBuilder.build()
                        .put()
                        .uri(productServiceUrl + "/api/products/" + item.getProductId() + "/stock")
                        .bodyValue(java.util.Map.of("quantity", item.getQuantity()))
                        .retrieve()
                        .bodyToMono(java.util.Map.class)
                        .doOnSuccess(response -> {
                            Boolean success = (Boolean) response.get("success");
                            if (Boolean.TRUE.equals(success)) {
                                log.info("Successfully updated stock for product {} by {} units", 
                                        item.getProductId(), item.getQuantity());
                            } else {
                                log.warn("Failed to update stock for product {}: insufficient stock", 
                                        item.getProductId());
                            }
                        })
                        .doOnError(error -> {
                            log.error("Error updating stock for product {}: {}", 
                                    item.getProductId(), error.getMessage());
                        })
                        .subscribe();
            } catch (Exception e) {
                log.error("Exception while updating stock for product {}: {}", 
                        item.getProductId(), e.getMessage());
            }
        }
    }
    
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerName(order.getCustomerName());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentId(order.getPaymentId());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getProductId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());
        dto.setItems(itemDTOs);
        
        return dto;
    }
}
