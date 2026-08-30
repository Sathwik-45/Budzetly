package com.budzetly.service;

import com.budzetly.dto.EarnRegistrationRequest;
import com.budzetly.entity.EarnProfile;
import com.budzetly.entity.User;
import com.budzetly.repository.EarnProfileRepository;
import com.budzetly.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class EarnService {

    private final EarnProfileRepository earnProfileRepository;
    private final UserRepository userRepository;

    public EarnService(
            EarnProfileRepository earnProfileRepository,
            UserRepository userRepository) {

        this.earnProfileRepository = earnProfileRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // REGISTER USER FOR EARN
    // ==========================================

    public void registerForEarn(
            Long userId,
            EarnRegistrationRequest request) {

        if (earnProfileRepository.existsByUserId(userId)) {

            throw new RuntimeException(
                    "User is already registered for Earn");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        EarnProfile earnProfile = new EarnProfile();

        earnProfile.setUser(user);

        earnProfile.setBusinessName(
                request.getBusinessName());

        earnProfile.setDescription(
                request.getDescription());

        earnProfile.setLocation(
                request.getLocation());

        earnProfileRepository.save(
                earnProfile);

        System.out.println(
                "🔥 EARN PROFILE CREATED FOR USER: "
                        + userId);
    }

    // ==========================================
    // GET CURRENT USER EARN PROFILE
    // ==========================================

    public EarnProfile getEarnProfile(Long userId) {

        System.out.println(
                "🔥 SEARCHING EARN PROFILE FOR USER: "
                        + userId);

        return earnProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new RuntimeException(
                        "Earn profile not found"));
    }
}