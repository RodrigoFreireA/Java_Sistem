package com.toylog.service;

import com.toylog.domain.Role;
import com.toylog.domain.UserAccount;
import com.toylog.dto.UserProfileDTO;
import com.toylog.dto.CustomerRegistrationRequest;
import com.toylog.dto.CustomerUpdateRequest;
import com.toylog.repository.UserAccountRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserAccount registerCustomer(CustomerRegistrationRequest req) {
        if (userAccountRepository.existsByUsername(req.username)) {
            throw new DataIntegrityViolationException("Username already exists");
        }
        UserAccount user = new UserAccount();
        user.setUsername(req.username);
        user.setPassword(passwordEncoder.encode(req.password));
        user.setRole(Role.CUSTOMER);
        user.setName(req.name);
        user.setPhone(req.phone);
        user.setEmail(req.email);
        user.setAddressLine(req.addressLine);
        user.setCity(req.city);
        user.setState(req.state);
        user.setPostalCode(req.postalCode);
        return userAccountRepository.save(user);
    }

    public UserProfileDTO getProfile(String username) {
        UserAccount user = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        UserProfileDTO dto = new UserProfileDTO();
        dto.username = user.getUsername();
        dto.role = user.getRole();
        dto.name = user.getName();
        dto.phone = user.getPhone();
        dto.email = user.getEmail();
        dto.addressLine = user.getAddressLine();
        dto.city = user.getCity();
        dto.state = user.getState();
        dto.postalCode = user.getPostalCode();
        dto.addressComplete = user.isAddressComplete();
        return dto;
    }

    @Transactional
    public UserProfileDTO updateProfile(String username, CustomerUpdateRequest req) {
        UserAccount user = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        user.setName(req.name);
        user.setPhone(req.phone);
        user.setEmail(req.email);
        user.setAddressLine(req.addressLine);
        user.setCity(req.city);
        user.setState(req.state);
        user.setPostalCode(req.postalCode);
        if (req.password != null && !req.password.isBlank()) {
            user.setPassword(passwordEncoder.encode(req.password));
        }
        userAccountRepository.save(user);
        return getProfile(username);
    }
}
