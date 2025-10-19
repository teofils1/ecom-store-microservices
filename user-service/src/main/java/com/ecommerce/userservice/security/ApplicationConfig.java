package com.ecommerce.userservice.security;

import com.ecommerce.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return usernameOrEmail -> {
            log.debug("Looking up user by: {}", usernameOrEmail);
            
            // Try to find by email first (new tokens)
            return userRepository.findByEmail(usernameOrEmail)
                    .or(() -> {
                        // Fallback to username for old tokens
                        log.debug("Email not found, trying username: {}", usernameOrEmail);
                        return userRepository.findByUsername(usernameOrEmail);
                    })
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail));
        };
    }
}
