package com.budzetly.config;

import com.budzetly.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter) {

                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        // ==========================================
        // PASSWORD ENCODER
        // ==========================================

        @Bean
        public PasswordEncoder passwordEncoder() {

                return new BCryptPasswordEncoder();
        }

        // ==========================================
        // CORS
        // ==========================================

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                List.of(
                                                "http://localhost:5173",
                                                "https://budzetly.vercel.app",
                                                "https://budzetly-mvzfk5cgy-projects-projects-344c83e7.vercel.app"));

                configuration.setAllowedMethods(
                                List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "DELETE",
                                                "PATCH",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of("*"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }
        // ==========================================
        // SECURITY FILTER CHAIN
        // ==========================================

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http

                                .cors(cors -> {
                                })

                                .csrf(csrf -> csrf.disable())

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // ----------------------------------
                                                // PUBLIC AUTH APIs
                                                // ----------------------------------

                                                .requestMatchers(
                                                                "/api/auth/register",
                                                                "/api/auth/login")
                                                .permitAll()

                                                // ----------------------------------
                                                // PUBLIC FOOD PRODUCTS
                                                // ----------------------------------
                                                // Anyone can view food products.

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/products")
                                                .permitAll()

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/products/**")
                                                .permitAll()

                                                // ----------------------------------
                                                // UPLOADED FOOD IMAGES
                                                // ----------------------------------

                                                .requestMatchers(
                                                                "/uploads/**")
                                                .permitAll()

                                                // ----------------------------------
                                                // EARN APIs
                                                // ----------------------------------

                                                .requestMatchers(
                                                                "/api/earn/**")
                                                .authenticated()

                                                // ----------------------------------
                                                // ADD / MODIFY PRODUCTS
                                                // ----------------------------------

                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/products")
                                                .authenticated()

                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/products/**")
                                                .authenticated()

                                                .requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/api/products/**")
                                                .authenticated()
                                                .requestMatchers(
                                                                "/api/orders/**")
                                                .authenticated()
                                                // ----------------------------------
                                                // EVERYTHING ELSE
                                                // ----------------------------------

                                                .anyRequest().authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}