package com.toylog.config;

import com.toylog.domain.Role;
import com.toylog.domain.UserAccount;
import com.toylog.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserAccountRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (!repo.existsByUsername("admin")) {
                UserAccount admin = new UserAccount();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("adminpass"));
                admin.setRole(Role.ADMIN);
                admin.setName("Administrador");
                repo.save(admin);
            }
        };
    }
}
