package com.budzetly.controller;

import com.budzetly.dto.ProductRequest;
import com.budzetly.entity.Product;
import com.budzetly.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService) {

        this.productService = productService;
    }

    // ==========================================
    // ADD PRODUCT
    // ==========================================

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") ProductRequest request,
            @RequestPart("image") MultipartFile image,
            Authentication authentication) {

        System.out.println("🔥🔥🔥 PRODUCT CONTROLLER REACHED 🔥🔥🔥");

        Long userId = Long.valueOf(authentication.getName());

        System.out.println(
                "🔥 PRODUCT REQUEST FROM USER ID: " + userId);

        Product product = productService.addProduct(
                userId,
                request,
                image);

        return ResponseEntity.ok(product);
    }
    // ==========================================
    // MY PRODUCTS
    // ==========================================

    @GetMapping("/my")
    public ResponseEntity<List<Product>> getMyProducts(
            Authentication authentication) {

        Long userId = Long.valueOf(
                authentication.getName());

        return ResponseEntity.ok(
                productService.getMyProducts(
                        userId));
    }

    // ==========================================
    // ALL PRODUCTS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts());
    }
}