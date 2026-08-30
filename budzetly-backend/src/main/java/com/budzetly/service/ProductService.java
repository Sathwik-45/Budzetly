package com.budzetly.service;

import com.budzetly.dto.ProductRequest;
import com.budzetly.entity.EarnProfile;
import com.budzetly.entity.Product;
import com.budzetly.entity.User;
import com.budzetly.repository.EarnProfileRepository;
import com.budzetly.repository.ProductRepository;
import com.budzetly.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final EarnProfileRepository earnProfileRepository;
    private final UserRepository userRepository;
    private final ImageStorageService imageStorageService;

    public ProductService(
            ProductRepository productRepository,
            EarnProfileRepository earnProfileRepository,
            UserRepository userRepository,
            ImageStorageService imageStorageService) {

        this.productRepository = productRepository;
        this.earnProfileRepository = earnProfileRepository;
        this.userRepository = userRepository;
        this.imageStorageService = imageStorageService;
    }

    // ==========================================
    // ADD PRODUCT
    // ==========================================

    public Product addProduct(
            Long userId,
            ProductRequest request,
            MultipartFile image) {

        System.out.println(
                "🔥 ADD PRODUCT FOR USER ID: "
                        + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        System.out.println(
                "✅ USER FOUND: "
                        + user.getId());

        EarnProfile earnProfile = earnProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new RuntimeException(
                        "User is not registered for Earn"));

        System.out.println(
                "✅ EARN PROFILE FOUND: "
                        + earnProfile.getId());

        // ======================================
        // SAVE IMAGE
        // ======================================

        String imageUrl = imageStorageService.saveImage(
                image);

        // ======================================
        // CREATE PRODUCT
        // ======================================

        Product product = new Product();

        product.setName(
                request.getName());

        product.setDescription(
                request.getDescription());

        product.setPrice(
                request.getPrice());

        product.setImageUrl(
                imageUrl);

        product.setLocation(
                request.getLocation());

        product.setLatitude(
                request.getLatitude());

        product.setLongitude(
                request.getLongitude());

        product.setAvailableQuantity(
                request.getAvailableQuantity());

        product.setEarnProfile(
                earnProfile);

        Product savedProduct = productRepository.save(product);

        System.out.println(
                "✅ PRODUCT CREATED: "
                        + savedProduct.getId());

        return savedProduct;
    }

    // ==========================================
    // GET MY PRODUCTS
    // ==========================================

    public List<Product> getMyProducts(
            Long userId) {

        EarnProfile earnProfile = earnProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new RuntimeException(
                        "Earn profile not found"));

        return productRepository
                .findByEarnProfileId(
                        earnProfile.getId());
    }

    // ==========================================
    // GET ALL PRODUCTS
    // ==========================================

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }
}