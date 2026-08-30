package com.budzetly.controller;

import com.budzetly.dto.CreateOrderRequest;
import com.budzetly.dto.OrderResponse;
import com.budzetly.entity.Order;
import com.budzetly.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

        private final OrderService orderService;

        public OrderController(OrderService orderService) {
                this.orderService = orderService;
        }

        // =========================================================
        // CREATE ORDER
        // =========================================================

        @PostMapping
        public ResponseEntity<?> createOrder(
                        @RequestBody CreateOrderRequest request,
                        Authentication authentication) {

                try {

                        Long userId = (Long) authentication.getPrincipal();

                        System.out.println(
                                        "🔥 ORDER USER ID: " + userId);

                        Order order = orderService.createOrder(
                                        userId,
                                        request);

                        System.out.println(
                                        "✅ ORDER CREATED: "
                                                        + order.getId());

                        return ResponseEntity.ok(order);

                } catch (Exception e) {

                        e.printStackTrace();

                        return ResponseEntity
                                        .badRequest()
                                        .body(e.getMessage());
                }
        }

        // =========================================================
        // CUSTOMER - MY ORDERS
        // =========================================================

        @GetMapping("/my")
        public ResponseEntity<?> getMyOrders(
                        Authentication authentication) {

                try {

                        Long userId = (Long) authentication.getPrincipal();

                        System.out.println(
                                        "🔥 MY ORDERS USER ID: "
                                                        + userId);

                        List<OrderResponse> orders = orderService.getOrdersByUser(
                                        userId);

                        System.out.println(
                                        "✅ CUSTOMER ORDERS FOUND: "
                                                        + orders.size());

                        return ResponseEntity.ok(orders);

                } catch (Exception e) {

                        e.printStackTrace();

                        return ResponseEntity
                                        .badRequest()
                                        .body(e.getMessage());
                }
        }

        // =========================================================
        // EARNER - ORDERS RECEIVED FOR MY PRODUCTS
        // =========================================================

        @GetMapping("/earner")
        public ResponseEntity<?> getEarnerOrders(
                        Authentication authentication) {

                try {

                        Long userId = (Long) authentication.getPrincipal();

                        System.out.println(
                                        "🔥 EARNER ORDERS USER ID: "
                                                        + userId);

                        List<OrderResponse> orders = orderService.getOrdersForEarner(
                                        userId);

                        System.out.println(
                                        "✅ EARNER ORDERS FOUND: "
                                                        + orders.size());

                        return ResponseEntity.ok(orders);

                } catch (Exception e) {

                        e.printStackTrace();

                        return ResponseEntity
                                        .badRequest()
                                        .body(e.getMessage());
                }
        }

        @PutMapping("/{orderId}/status")
        public ResponseEntity<?> updateOrderStatus(
                        @PathVariable Long orderId,
                        @RequestParam String status,
                        Authentication authentication) {

                try {

                        Long userId = (Long) authentication.getPrincipal();

                        System.out.println(
                                        "🔥 STATUS UPDATE");

                        System.out.println(
                                        "Order ID: " + orderId);

                        System.out.println(
                                        "Earner ID: " + userId);

                        System.out.println(
                                        "New Status: " + status);

                        Order updatedOrder = orderService.updateOrderStatus(
                                        orderId,
                                        userId,
                                        status);

                        return ResponseEntity.ok(
                                        updatedOrder);

                } catch (Exception e) {

                        e.printStackTrace();

                        return ResponseEntity
                                        .badRequest()
                                        .body(e.getMessage());
                }
        }
}
