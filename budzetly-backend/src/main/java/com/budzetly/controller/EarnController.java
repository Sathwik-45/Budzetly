package com.budzetly.controller;

import com.budzetly.dto.EarnRegistrationRequest;
import com.budzetly.entity.EarnProfile;
import com.budzetly.service.EarnService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/earn")
public class EarnController {

    private final EarnService earnService;

    public EarnController(EarnService earnService) {
        this.earnService = earnService;
    }

    // ==========================================
    // REGISTER FOR EARN
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<String> registerForEarn(
            @RequestBody EarnRegistrationRequest request,
            Authentication authentication) {

        Long userId = ((Number) authentication.getPrincipal()).longValue();

        System.out.println(
                "🔥 REGISTER EARN USER ID: "
                        + userId);

        earnService.registerForEarn(
                userId,
                request);

        return ResponseEntity.ok(
                "Successfully registered for Earn");
    }

    // ==========================================
    // GET CURRENT USER'S EARN PROFILE
    // ==========================================

    @GetMapping("/me")
    public ResponseEntity<EarnProfile> getMyEarnProfile(
            Authentication authentication) {

        Long userId = ((Number) authentication.getPrincipal()).longValue();

        System.out.println(
                "🔥 GET EARN PROFILE USER ID: "
                        + userId);

        EarnProfile profile = earnService.getEarnProfile(userId);

        return ResponseEntity.ok(profile);
    }
}