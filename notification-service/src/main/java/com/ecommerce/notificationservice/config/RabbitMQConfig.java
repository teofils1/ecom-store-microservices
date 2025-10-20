package com.ecommerce.notificationservice.config;

import com.ecommerce.notificationservice.event.OrderEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * RabbitMQ Configuration for Notification Service
 * Handles message conversion and type mapping between services
 */
@Configuration
public class RabbitMQConfig {
    
    /**
     * Configure JSON message converter with Jackson
     * Maps the OrderEvent from order-service to notification-service's OrderEvent class
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter(objectMapper);
        
        // Create custom class mapper to handle type mapping
        DefaultClassMapper classMapper = new DefaultClassMapper();
        
        // Map the incoming OrderEvent type to our local OrderEvent class
        Map<String, Class<?>> idClassMapping = new HashMap<>();
        idClassMapping.put("com.ecommerce.orderservice.event.OrderEvent", OrderEvent.class);
        classMapper.setIdClassMapping(idClassMapping);
        
        // Set trusted packages to allow deserialization
        classMapper.setTrustedPackages("com.ecommerce.*");
        
        converter.setClassMapper(classMapper);
        
        return converter;
    }
    
    /**
     * Configure RabbitTemplate with JSON message converter
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
