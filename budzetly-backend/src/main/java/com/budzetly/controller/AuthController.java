package com.budzetly.controller;

import com.budzetly.dto.LoginRequest;
import com.budzetly.dto.LoginResponse;
import com.budzetly.dto.RegisterUserRequest;
import com.budzetly.dto.UserResponse;
import com.budzetly.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse register(
            @Valid @RequestBody RegisterUserRequest request) {

        return userService.createUser(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        return userService.login(request);
    }

}