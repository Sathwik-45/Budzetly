package com.budzetly.repository;

import com.budzetly.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    List<Product> findByEarnProfileId(Long earnProfileId);
}