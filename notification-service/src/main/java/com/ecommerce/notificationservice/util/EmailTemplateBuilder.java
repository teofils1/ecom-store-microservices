package com.ecommerce.notificationservice.util;

import com.ecommerce.notificationservice.model.NotificationType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Email Template Builder
 * Creates professional HTML email templates for various notification types
 */
public class EmailTemplateBuilder {
    
    private static final String BASE_TEMPLATE = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #4CAF50;
                    }
                    .header h1 {
                        color: #4CAF50;
                        margin: 0;
                        font-size: 28px;
                    }
                    .content {
                        padding: 20px 0;
                    }
                    .order-info {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 15px 0;
                    }
                    .order-info p {
                        margin: 8px 0;
                    }
                    .label {
                        font-weight: bold;
                        color: #555;
                    }
                    .value {
                        color: #333;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #777;
                        font-size: 12px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #4CAF50;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 15px 0;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 5px 10px;
                        border-radius: 3px;
                        font-weight: bold;
                        font-size: 14px;
                    }
                    .status-created { background-color: #2196F3; color: white; }
                    .status-confirmed { background-color: #FF9800; color: white; }
                    .status-paid { background-color: #4CAF50; color: white; }
                    .status-shipped { background-color: #9C27B0; color: white; }
                    .status-delivered { background-color: #00BCD4; color: white; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛒 E-Commerce Store</h1>
                    </div>
                    <div class="content">
                        %s
                    </div>
                    <div class="footer">
                        <p>This is an automated message from E-Commerce Store</p>
                        <p>© %d E-Commerce Store. All rights reserved.</p>
                        <p>If you have any questions, please contact our support team.</p>
                    </div>
                </div>
            </body>
            </html>
            """;
    
    public static String buildOrderCreatedEmail(String customerName, Long orderId, 
                                                BigDecimal totalAmount, String shippingAddress) {
        String content = String.format("""
                <h2>Order Created Successfully! 🎉</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>Thank you for your order! We're excited to confirm that your order has been successfully placed.</p>
                
                <div class="order-info">
                    <p><span class="label">Order Number:</span> <span class="value">#%d</span></p>
                    <p><span class="label">Status:</span> <span class="status-badge status-created">ORDER CREATED</span></p>
                    <p><span class="label">Total Amount:</span> <span class="value">$%.2f</span></p>
                    <p><span class="label">Shipping Address:</span> <span class="value">%s</span></p>
                    <p><span class="label">Order Date:</span> <span class="value">%s</span></p>
                </div>
                
                <p>We'll send you another email once your order is confirmed and being prepared for shipment.</p>
                <p>Thank you for shopping with us!</p>
                """, 
                customerName, orderId, totalAmount, shippingAddress, 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")));
        
        return String.format(BASE_TEMPLATE, content, LocalDateTime.now().getYear());
    }
    
    public static String buildOrderConfirmedEmail(String customerName, Long orderId, BigDecimal totalAmount) {
        String content = String.format("""
                <h2>Order Confirmed! ✅</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>Great news! Your order has been confirmed and is being prepared.</p>
                
                <div class="order-info">
                    <p><span class="label">Order Number:</span> <span class="value">#%d</span></p>
                    <p><span class="label">Status:</span> <span class="status-badge status-confirmed">ORDER CONFIRMED</span></p>
                    <p><span class="label">Total Amount:</span> <span class="value">$%.2f</span></p>
                </div>
                
                <p>Your order is now in our processing queue. We'll notify you once payment is confirmed and your items are ready to ship.</p>
                <p>Estimated processing time: 1-2 business days</p>
                """, 
                customerName, orderId, totalAmount);
        
        return String.format(BASE_TEMPLATE, content, LocalDateTime.now().getYear());
    }
    
    public static String buildOrderPaidEmail(String customerName, Long orderId, 
                                            BigDecimal totalAmount, String paymentMethod) {
        String content = String.format("""
                <h2>Payment Received! 💳</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>We have successfully received your payment. Thank you!</p>
                
                <div class="order-info">
                    <p><span class="label">Order Number:</span> <span class="value">#%d</span></p>
                    <p><span class="label">Status:</span> <span class="status-badge status-paid">PAYMENT CONFIRMED</span></p>
                    <p><span class="label">Amount Paid:</span> <span class="value">$%.2f</span></p>
                    <p><span class="label">Payment Method:</span> <span class="value">%s</span></p>
                    <p><span class="label">Payment Date:</span> <span class="value">%s</span></p>
                </div>
                
                <p>Your order will be shipped soon. You'll receive a tracking number once it's on its way.</p>
                <p>Thank you for your business!</p>
                """, 
                customerName, orderId, totalAmount, paymentMethod,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")));
        
        return String.format(BASE_TEMPLATE, content, LocalDateTime.now().getYear());
    }
    
    public static String buildOrderShippedEmail(String customerName, Long orderId, String shippingAddress) {
        String content = String.format("""
                <h2>Order Shipped! 📦</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>Excellent news! Your order has been shipped and is on its way to you.</p>
                
                <div class="order-info">
                    <p><span class="label">Order Number:</span> <span class="value">#%d</span></p>
                    <p><span class="label">Status:</span> <span class="status-badge status-shipped">SHIPPED</span></p>
                    <p><span class="label">Shipping Address:</span> <span class="value">%s</span></p>
                    <p><span class="label">Shipped Date:</span> <span class="value">%s</span></p>
                </div>
                
                <p>Your package should arrive within 3-5 business days.</p>
                <p>We hope you enjoy your purchase!</p>
                """, 
                customerName, orderId, shippingAddress,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")));
        
        return String.format(BASE_TEMPLATE, content, LocalDateTime.now().getYear());
    }
    
    public static String buildOrderDeliveredEmail(String customerName, Long orderId) {
        String content = String.format("""
                <h2>Order Delivered! 🎁</h2>
                <p>Dear <strong>%s</strong>,</p>
                <p>Your order has been successfully delivered. We hope you love it!</p>
                
                <div class="order-info">
                    <p><span class="label">Order Number:</span> <span class="value">#%d</span></p>
                    <p><span class="label">Status:</span> <span class="status-badge status-delivered">DELIVERED</span></p>
                    <p><span class="label">Delivered Date:</span> <span class="value">%s</span></p>
                </div>
                
                <p>If you have any issues with your order, please don't hesitate to contact us.</p>
                <p>We'd love to hear your feedback about your shopping experience!</p>
                <p>Thank you for choosing E-Commerce Store! 🌟</p>
                """, 
                customerName, orderId,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")));
        
        return String.format(BASE_TEMPLATE, content, LocalDateTime.now().getYear());
    }
}
