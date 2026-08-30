package com.budzetly.repository;

import com.budzetly.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByCustomerIdOrderByCreatedAtDesc(
            Long customerId);

    List<Order> findDistinctByItemsEarnProfileUserIdOrderByCreatedAtDesc(
            Long userId);

    List<Order> findByCustomerIdOrderByIdDesc(Long userId);
}