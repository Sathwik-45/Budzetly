package com.budzetly.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageStorageService {

        private final Cloudinary cloudinary;

        public ImageStorageService(
                        @Value("${cloudinary.cloud-name}") String cloudName,
                        @Value("${cloudinary.api-key}") String apiKey,
                        @Value("${cloudinary.api-secret}") String apiSecret) {

                this.cloudinary = new Cloudinary(
                                ObjectUtils.asMap(
                                                "cloud_name", cloudName,
                                                "api_key", apiKey,
                                                "api_secret", apiSecret,
                                                "secure", true));
        }

        public String saveImage(
                        MultipartFile file) {

                // ==========================================
                // VALIDATE IMAGE
                // ==========================================

                if (file == null ||
                                file.isEmpty()) {

                        throw new RuntimeException(
                                        "Image is required");
                }

                // ==========================================
                // VALIDATE IMAGE TYPE
                // ==========================================

                String contentType = file.getContentType();

                if (contentType == null ||
                                !contentType.startsWith("image/")) {

                        throw new RuntimeException(
                                        "Only image files are allowed");
                }

                // ==========================================
                // UPLOAD TO CLOUDINARY
                // ==========================================

                try {

                        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                                        file.getBytes(),
                                        ObjectUtils.asMap(
                                                        "folder",
                                                        "budzetly/products",

                                                        "resource_type",
                                                        "image"));

                        // ======================================
                        // GET SECURE CLOUDINARY URL
                        // ======================================

                        String secureUrl = (String) uploadResult.get(
                                        "secure_url");

                        if (secureUrl == null ||
                                        secureUrl.isEmpty()) {

                                throw new RuntimeException(
                                                "Cloudinary did not return image URL");
                        }

                        System.out.println(
                                        "☁️ CLOUDINARY IMAGE URL: "
                                                        + secureUrl);

                        return secureUrl;

                } catch (IOException e) {

                        e.printStackTrace();

                        throw new RuntimeException(
                                        "Failed to upload image to Cloudinary",
                                        e);
                }
        }
}