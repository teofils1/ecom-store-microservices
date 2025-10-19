package com.ecommerce.userservice.controller;

import com.ecommerce.userservice.dto.UserDTO;
import com.ecommerce.userservice.model.Role;
import com.ecommerce.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(userService.getDashboardStats());
    }
}
