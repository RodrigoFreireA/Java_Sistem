package com.toylog.config;

import com.toylog.controller.JwtAuthenticationFilter;
import com.toylog.config.JwtUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.authentication.AuthenticationConfiguration;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService users(PasswordEncoder encoder) {
        InMemoryUserDetailsManager uds = new InMemoryUserDetailsManager();

        uds.createUser(User.withUsername("gerente").password(encoder.encode("gerentepass")).roles("GERENTE").build());
        uds.createUser(User.withUsername("vendedor").password(encoder.encode("vendedorpass")).roles("VENDEDOR").build());

        return uds;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/products").hasRole("GERENTE")
                .requestMatchers(HttpMethod.GET, "/api/products/low-stock").hasRole("GERENTE")
                .requestMatchers(HttpMethod.POST, "/api/products/**/decrease").hasAnyRole("VENDEDOR","GERENTE")
                .requestMatchers(HttpMethod.POST, "/api/orders").hasAnyRole("VENDEDOR","GERENTE")
                .anyRequest().authenticated();

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Create JwtAuthenticationFilter bean wiring JwtUtils and UserDetailsService
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtils jwtUtils, UserDetailsService uds) {
        return new JwtAuthenticationFilter(jwtUtils, uds);
    }
}
