package com.ecommerce.orderservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Customer email is required")
    private String customerEmail;
    
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemDTO> items;
    
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
