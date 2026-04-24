package com.insurai.backend.controller;

import com.insurai.backend.dto.AuthRequest;
import com.insurai.backend.dto.TokenResponse;
import com.insurai.backend.model.UserAccount;
import com.insurai.backend.repository.UserAccountRepository;
import com.insurai.backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserAccountRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (request.email() == null || request.email().isBlank() || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists"));
        }

        UserAccount user = new UserAccount("u_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8), request.email(), passwordEncoder.encode(request.password()));
        userRepository.save(user);
        return ResponseEntity.ok(new TokenResponse(jwtService.generateToken(user.getId(), user.getEmail())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        if (request.email() == null || request.email().isBlank() || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        return userRepository.findByEmailIgnoreCase(request.email())
                .filter(user -> passwordEncoder.matches(request.password(), user.getPasswordHash()))
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(new TokenResponse(jwtService.generateToken(user.getId(), user.getEmail()))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials")));
    }
}
