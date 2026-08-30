package com.budzetly.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageStorageService {

    private final Path uploadDirectory = Paths.get("uploads");

    public ImageStorageService() {

        try {

            Files.createDirectories(
                    uploadDirectory);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create upload directory",
                    e);
        }
    }

    public String saveImage(
            MultipartFile file) {

        if (file == null ||
                file.isEmpty()) {

            throw new RuntimeException(
                    "Image is required");
        }

        String originalName = file.getOriginalFilename();

        String extension = "";

        if (originalName != null &&
                originalName.contains(".")) {

            extension = originalName.substring(
                    originalName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID()
                + extension;

        Path filePath = uploadDirectory.resolve(
                fileName);

        try {

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save image",
                    e);
        }

        return "/uploads/" + fileName;
    }
}