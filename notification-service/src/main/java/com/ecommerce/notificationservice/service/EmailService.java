package com.ecommerce.notificationservice.service;

/**
 * Email Service Interface
 * Provides methods for sending emails
 */
public interface EmailService {
    
    /**
     * Send a plain text email
     * @param to Recipient email address
     * @param subject Email subject
     * @param text Email body (plain text)
     * @return true if email sent successfully, false otherwise
     */
    boolean sendSimpleEmail(String to, String subject, String text);
    
    /**
     * Send an HTML email
     * @param to Recipient email address
     * @param subject Email subject
     * @param htmlContent Email body (HTML)
     * @return true if email sent successfully, false otherwise
     */
    boolean sendHtmlEmail(String to, String subject, String htmlContent);
}
