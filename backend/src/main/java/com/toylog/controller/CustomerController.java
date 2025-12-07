package com.toylog.controller;

import com.toylog.config.JwtUtils;
import com.toylog.dto.CustomerRegistrationRequest;
import com.toylog.dto.CustomerUpdateRequest;
import com.toylog.dto.LoginResponse;
import com.toylog.dto.UserProfileDTO;
import com.toylog.service.UserAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final UserAccountService userAccountService;
    private final JwtUtils jwtUtils;

    public CustomerController(UserAccountService userAccountService, JwtUtils jwtUtils) {
        this.userAccountService = userAccountService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody CustomerRegistrationRequest req) {
        var user = userAccountService.registerCustomer(req);
        String token = jwtUtils.generateToken(
                user.getUsername(),
                List.of("ROLE_" + user.getRole().name())
        );
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @GetMapping("/me")
    public UserProfileDTO me(Authentication auth) {
        return userAccountService.getProfile(auth.getName());
    }

    @PutMapping("/me")
    public UserProfileDTO updateMe(Authentication auth, @Valid @RequestBody CustomerUpdateRequest req) {
        return userAccountService.updateProfile(auth.getName(), req);
    }
}
