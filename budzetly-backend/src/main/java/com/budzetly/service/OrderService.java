package com.budzetly.service;

import java.util.List;
import java.util.stream.Collectors;

import com.budzetly.dto.CreateOrderRequest;
import com.budzetly.dto.OrderItemRequest;
import com.budzetly.dto.OrderItemResponse;
import com.budzetly.dto.OrderResponse;
import com.budzetly.entity.EarnProfile;
import com.budzetly.entity.Order;
import com.budzetly.entity.OrderItem;
import com.budzetly.entity.Product;
import com.budzetly.entity.User;
import com.budzetly.repository.OrderRepository;
import com.budzetly.repository.ProductRepository;
import com.budzetly.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;

        public OrderService(
                        OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {

                this.orderRepository = orderRepository;
                this.productRepository = productRepository;
                this.userRepository = userRepository;
        }

        // =========================================================
        // CREATE ORDER
        // =========================================================

        @Transactional
        public Order createOrder(
                        Long customerId,
                        CreateOrderRequest request) {

                System.out.println(
                                "🔥 CREATING ORDER FOR USER: "
                                                + customerId);

                // =====================================================
                // CUSTOMER
                // =====================================================

                User customer = userRepository.findById(customerId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Customer not found"));

                // =====================================================
                // DELIVERY ADDRESS
                // =====================================================

                if (request.getDeliveryAddress() == null ||
                                request.getDeliveryAddress()
                                                .trim()
                                                .isEmpty()) {

                        throw new RuntimeException(
                                        "Delivery address is required");
                }

                // =====================================================
                // CART
                // =====================================================

                if (request.getItems() == null ||
                                request.getItems().isEmpty()) {

                        throw new RuntimeException(
                                        "Order must contain at least one product");
                }

                // =====================================================
                // CREATE ORDER
                // =====================================================

                Order order = new Order();

                order.setCustomer(customer);

                order.setDeliveryAddress(
                                request.getDeliveryAddress());

                // Currently only COD
                order.setPaymentMethod("COD");

                // Initial status
                order.setStatus("PLACED");

                order.setCreatedAt(
                                java.time.LocalDateTime.now());

                double total = 0.0;

                // =====================================================
                // CREATE ORDER ITEMS
                // =====================================================

                for (OrderItemRequest itemRequest : request.getItems()) {

                        // PRODUCT ID

                        if (itemRequest.getProductId() == null) {

                                throw new RuntimeException(
                                                "Product ID is required");
                        }

                        // QUANTITY

                        if (itemRequest.getQuantity() == null ||
                                        itemRequest.getQuantity() <= 0) {

                                throw new RuntimeException(
                                                "Quantity must be greater than zero");
                        }

                        // =================================================
                        // FIND PRODUCT
                        // =================================================

                        Product product = productRepository.findById(
                                        itemRequest.getProductId()).orElseThrow(
                                                        () -> new RuntimeException(
                                                                        "Product not found: "
                                                                                        + itemRequest
                                                                                                        .getProductId()));

                        // =================================================
                        // CHECK STOCK
                        // =================================================

                        if (product.getAvailableQuantity() < itemRequest.getQuantity()) {

                                throw new RuntimeException(
                                                "Not enough stock for "
                                                                + product.getName());
                        }

                        // =================================================
                        // GET SELLER
                        // =================================================

                        EarnProfile earnProfile = product.getEarnProfile();

                        if (earnProfile == null) {

                                throw new RuntimeException(
                                                "Product does not have a seller");
                        }

                        // =================================================
                        // CREATE ORDER ITEM
                        // =================================================

                        OrderItem orderItem = new OrderItem();

                        orderItem.setProduct(product);

                        orderItem.setEarnProfile(
                                        earnProfile);

                        orderItem.setProductName(
                                        product.getName());

                        // Save price at purchase time
                        orderItem.setPriceAtPurchase(
                                        product.getPrice());

                        orderItem.setQuantity(
                                        itemRequest.getQuantity());

                        // Add item to order
                        order.addItem(orderItem);

                        // =================================================
                        // CALCULATE TOTAL
                        // =================================================

                        total += product.getPrice()
                                        * itemRequest.getQuantity();

                        // =================================================
                        // REDUCE STOCK
                        // =================================================

                        product.setAvailableQuantity(
                                        product.getAvailableQuantity()
                                                        - itemRequest.getQuantity());

                        productRepository.save(product);
                }

                // =====================================================
                // SET TOTAL
                // =====================================================

                order.setTotalAmount(total);

                // =====================================================
                // SAVE ORDER
                // =====================================================

                Order savedOrder = orderRepository.save(order);

                System.out.println(
                                "✅ ORDER CREATED: "
                                                + savedOrder.getId());

                return savedOrder;
        }

        // =========================================================
        // CUSTOMER - MY ORDERS
        // =========================================================

        public List<OrderResponse> getOrdersByUser(
                        Long userId) {

                System.out.println(
                                "🔥 GETTING ORDERS FOR USER: "
                                                + userId);

                List<Order> orders = orderRepository
                                .findByCustomerIdOrderByIdDesc(
                                                userId);

                return convertOrdersToResponse(
                                orders);
        }

        // =========================================================
        // EARNER - ORDERS FOR MY PRODUCTS
        // =========================================================

        public List<OrderResponse> getOrdersForEarner(
                        Long userId) {

                System.out.println(
                                "🔥 FINDING ORDERS FOR EARNER: "
                                                + userId);

                List<Order> orders = orderRepository
                                .findDistinctByItemsEarnProfileUserIdOrderByCreatedAtDesc(
                                                userId);

                System.out.println(
                                "🔥 ORDERS FOUND FOR EARNER: "
                                                + orders.size());

                return convertOrdersToResponse(
                                orders);
        }

        // =========================================================
        // EARNER - UPDATE ORDER STATUS
        // =========================================================

        @Transactional
        public Order updateOrderStatus(
                        Long orderId,
                        Long earnerId,
                        String status) {

                System.out.println(
                                "🔥 UPDATING ORDER STATUS");

                System.out.println(
                                "🔥 ORDER ID: "
                                                + orderId);

                System.out.println(
                                "🔥 EARNER ID: "
                                                + earnerId);

                System.out.println(
                                "🔥 NEW STATUS: "
                                                + status);

                // =====================================================
                // FIND ORDER
                // =====================================================

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Order not found"));

                // =====================================================
                // NORMALIZE STATUS
                // =====================================================

                if (status == null ||
                                status.trim().isEmpty()) {

                        throw new RuntimeException(
                                        "Order status is required");
                }

                String newStatus = status.trim()
                                .toUpperCase();

                // =====================================================
                // CHECK VALID STATUS
                // =====================================================

                if (!newStatus.equals("CONFIRMED") &&
                                !newStatus.equals("PREPARING") &&
                                !newStatus.equals("DISPATCHED") &&
                                !newStatus.equals("DELIVERED") &&
                                !newStatus.equals("CANCELLED")) {

                        throw new RuntimeException(
                                        "Invalid order status: "
                                                        + newStatus);
                }

                // =====================================================
                // CHECK EARner OWNS PRODUCT
                // =====================================================
                boolean ownsOrder = order.getItems()
                                .stream()
                                .anyMatch(item -> {

                                        if (item.getEarnProfile() == null) {
                                                return false;
                                        }

                                        if (item.getEarnProfile().getUser() == null) {
                                                return false;
                                        }

                                        long sellerId = item.getEarnProfile()
                                                        .getUser()
                                                        .getId();

                                        return sellerId == earnerId;
                                });

                if (!ownsOrder) {

                        throw new RuntimeException(
                                        "You are not authorized to update this order");
                }

                // =====================================================
                // CHECK STATUS FLOW
                // =====================================================

                String currentStatus = order.getStatus();

                if (currentStatus == null) {

                        currentStatus = "PLACED";
                }

                // PLACED → CONFIRMED

                if (newStatus.equals("CONFIRMED")) {

                        if (!currentStatus.equals("PLACED")) {

                                throw new RuntimeException(
                                                "Order cannot be confirmed from "
                                                                + currentStatus);
                        }
                }

                // CONFIRMED → PREPARING

                if (newStatus.equals("PREPARING")) {

                        if (!currentStatus.equals("CONFIRMED")) {

                                throw new RuntimeException(
                                                "Order cannot be moved to preparing from "
                                                                + currentStatus);
                        }
                }

                // PREPARING → DISPATCHED

                if (newStatus.equals("DISPATCHED")) {

                        if (!currentStatus.equals("PREPARING")) {

                                throw new RuntimeException(
                                                "Order cannot be dispatched from "
                                                                + currentStatus);
                        }
                }

                // DISPATCHED → DELIVERED

                if (newStatus.equals("DELIVERED")) {

                        if (!currentStatus.equals("DISPATCHED")) {

                                throw new RuntimeException(
                                                "Order cannot be delivered from "
                                                                + currentStatus);
                        }
                }

                // =====================================================
                // CANCELLED
                // =====================================================

                if (newStatus.equals("CANCELLED")) {

                        if (currentStatus.equals("DELIVERED")) {

                                throw new RuntimeException(
                                                "Delivered order cannot be cancelled");
                        }
                }

                // =====================================================
                // UPDATE
                // =====================================================

                order.setStatus(
                                newStatus);

                Order savedOrder = orderRepository.save(order);

                System.out.println(
                                "✅ ORDER STATUS UPDATED: "
                                                + savedOrder.getId()
                                                + " → "
                                                + savedOrder.getStatus());

                return savedOrder;
        }

        // =========================================================
        // CONVERT ORDERS TO DTO
        // =========================================================

        private List<OrderResponse> convertOrdersToResponse(
                        List<Order> orders) {

                return orders.stream()
                                .map(order -> {

                                        List<OrderItemResponse> items = order.getItems()
                                                        .stream()
                                                        .map(item -> {

                                                                String imageUrl = null;

                                                                if (item.getProduct() != null) {

                                                                        imageUrl = item.getProduct()
                                                                                        .getImageUrl();
                                                                }

                                                                String sellerName = null;

                                                                if (item.getEarnProfile() != null) {

                                                                        sellerName = item.getEarnProfile()
                                                                                        .getBusinessName();
                                                                }

                                                                return new OrderItemResponse(

                                                                                item.getId(),

                                                                                item.getProductName(),

                                                                                item.getPriceAtPurchase(),

                                                                                item.getQuantity(),

                                                                                imageUrl,

                                                                                sellerName);

                                                        })
                                                        .collect(
                                                                        Collectors.toList());

                                        return new OrderResponse(

                                                        order.getId(),

                                                        order.getStatus(),

                                                        order.getPaymentMethod(),

                                                        order.getDeliveryAddress(),

                                                        order.getTotalAmount(),

                                                        order.getCreatedAt(),

                                                        items);

                                })
                                .collect(
                                                Collectors.toList());
        }
}