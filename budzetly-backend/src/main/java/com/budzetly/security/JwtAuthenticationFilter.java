package com.budzetly.security;

import com.budzetly.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final JwtService jwtService;

        public JwtAuthenticationFilter(
                        JwtService jwtService) {

                this.jwtService = jwtService;
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain)
                        throws ServletException, IOException {

                // ==========================================
                // REQUEST
                // ==========================================

                System.out.println(
                                "🔥 JWT FILTER: "
                                                + request.getMethod()
                                                + " "
                                                + request.getRequestURI());

                // ==========================================
                // GET AUTHORIZATION HEADER
                // ==========================================

                String authorizationHeader = request.getHeader("Authorization");

                System.out.println(
                                "🔥 AUTH HEADER: "
                                                + authorizationHeader);

                // ==========================================
                // NO TOKEN
                // ==========================================

                if (authorizationHeader == null ||
                                !authorizationHeader.startsWith("Bearer ")) {

                        System.out.println(
                                        "⚠️ NO JWT TOKEN");

                        filterChain.doFilter(
                                        request,
                                        response);

                        return;
                }

                // ==========================================
                // EXTRACT TOKEN
                // ==========================================

                String token = authorizationHeader.substring(7);

                System.out.println(
                                "🔥 TOKEN RECEIVED");

                // ==========================================
                // VALIDATE TOKEN
                // ==========================================

                boolean valid = jwtService.isTokenValid(token);

                System.out.println(
                                "🔥 JWT VALID: "
                                                + valid);

                // ==========================================
                // TOKEN IS VALID
                // ==========================================

                if (valid) {

                        // ======================================
                        // EXTRACT EMAIL
                        // ======================================

                        String email = jwtService.extractEmail(token);

                        // ======================================
                        // EXTRACT USER ID
                        // ======================================

                        Long userId = jwtService.extractUserId(token);

                        System.out.println(
                                        "🔥 JWT EMAIL: "
                                                        + email);

                        System.out.println(
                                        "🔥 JWT USER ID: "
                                                        + userId);

                        // ======================================
                        // CREATE AUTHENTICATION
                        // ======================================
                        //
                        // IMPORTANT:
                        //
                        // We are storing USER ID as the
                        // authentication principal.
                        //
                        // Therefore:
                        //
                        // authentication.getName()
                        //
                        // will give us the logged-in user's ID.
                        //
                        // Example:
                        //
                        // JWT → userId = 9
                        //
                        // authentication.getName()
                        // → "9"
                        //
                        // ======================================

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                        userId,
                                        null,
                                        Collections.emptyList());

                        // ======================================
                        // STORE IN SECURITY CONTEXT
                        // ======================================

                        SecurityContextHolder
                                        .getContext()
                                        .setAuthentication(
                                                        authentication);

                        System.out.println(
                                        "✅ SECURITY CONTEXT SET FOR USER ID: "
                                                        + userId);
                }

                // ==========================================
                // CONTINUE REQUEST
                // ==========================================

                filterChain.doFilter(
                                request,
                                response);
        }
}