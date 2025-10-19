package com.ecommerce.userservice.service;

import com.ecommerce.userservice.dto.AuthResponse;
import com.ecommerce.userservice.dto.LoginRequest;
import com.ecommerce.userservice.dto.RegisterRequest;
import com.ecommerce.userservice.model.Role;
import com.ecommerce.userservice.model.User;
import com.ecommerce.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        userRepository.save(user);
        
        var extraClaims = new java.util.HashMap<String, Object>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("id", user.getId());
        extraClaims.put("username", user.getUsername());
        var jwtToken = jwtService.generateToken(extraClaims, user);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var extraClaims = new java.util.HashMap<String, Object>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("id", user.getId());
        extraClaims.put("username", user.getUsername());
        var jwtToken = jwtService.generateToken(extraClaims, user);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
