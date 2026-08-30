package com.budzetly.repository;

import com.budzetly.entity.EarnProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EarnProfileRepository
        extends JpaRepository<EarnProfile, Long> {

    boolean existsByUserId(Long userId);

    Optional<EarnProfile> findByUserId(Long userId);
}