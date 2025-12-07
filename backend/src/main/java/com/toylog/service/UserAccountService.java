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
        dto.addressLine2 = user.getAddressLine2();
        dto.city2 = user.getCity2();
        dto.state2 = user.getState2();
        dto.postalCode2 = user.getPostalCode2();
        dto.addressLine3 = user.getAddressLine3();
        dto.city3 = user.getCity3();
        dto.state3 = user.getState3();
        dto.postalCode3 = user.getPostalCode3();
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
        user.setAddressLine2(req.addressLine2);
        user.setCity2(req.city2);
        user.setState2(req.state2);
        user.setPostalCode2(req.postalCode2);
        user.setAddressLine3(req.addressLine3);
        user.setCity3(req.city3);
        user.setState3(req.state3);
        user.setPostalCode3(req.postalCode3);
        if (req.password != null && !req.password.isBlank()) {
            user.setPassword(passwordEncoder.encode(req.password));
        }
        userAccountRepository.save(user);
        return getProfile(username);
    }
}
