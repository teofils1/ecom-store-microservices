package com.ecommerce.userservice.config;

import com.ecommerce.userservice.model.Role;
import com.ecommerce.userservice.model.User;
import com.ecommerce.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .firstName("Admin")
                    .lastName("User")
                    .phone("1234567890")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);

            // Create test customer
            User customer = User.builder()
                    .username("customer")
                    .email("customer@example.com")
                    .password(passwordEncoder.encode("Customer123!"))
                    .firstName("Test")
                    .lastName("Customer")
                    .phone("0987654321")
                    .role(Role.CUSTOMER)
                    .enabled(true)
                    .build();
            userRepository.save(customer);

            System.out.println("Initial users created successfully!");
            System.out.println("Admin - email: admin@example.com, password: Admin123!");
            System.out.println("Customer - email: customer@example.com, password: Customer123!");
        }
    }
}
