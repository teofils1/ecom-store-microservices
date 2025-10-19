package com.ecommerce.notificationservice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent implements Serializable {
    private Long orderId;
    private String customerEmail;
    private String customerName;
    private String status;
    private BigDecimal totalAmount;
    private List<OrderItemEvent> items;
    private String shippingAddress;
    private String paymentMethod;
    private LocalDateTime timestamp;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemEvent implements Serializable {
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }
}
