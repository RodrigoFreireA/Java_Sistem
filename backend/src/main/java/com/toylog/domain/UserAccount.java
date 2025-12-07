package com.toylog.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tb_users")
public class UserAccount {

    @Id
    private UUID id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String name;
    private String phone;
    @Email
    private String email;

    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
    private String addressLine2;
    private String city2;
    private String state2;
    private String postalCode2;
    private String addressLine3;
    private String city3;
    private String state3;
    private String postalCode3;

    private Instant createdAt = Instant.now();

    public UserAccount() {
        this.id = UUID.randomUUID();
    }

    public boolean isAddressComplete() {
        return notBlank(addressLine) && notBlank(city) && notBlank(state) && notBlank(postalCode);
    }

    private boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }
    public String getCity2() { return city2; }
    public void setCity2(String city2) { this.city2 = city2; }
    public String getState2() { return state2; }
    public void setState2(String state2) { this.state2 = state2; }
    public String getPostalCode2() { return postalCode2; }
    public void setPostalCode2(String postalCode2) { this.postalCode2 = postalCode2; }
    public String getAddressLine3() { return addressLine3; }
    public void setAddressLine3(String addressLine3) { this.addressLine3 = addressLine3; }
    public String getCity3() { return city3; }
    public void setCity3(String city3) { this.city3 = city3; }
    public String getState3() { return state3; }
    public void setState3(String state3) { this.state3 = state3; }
    public String getPostalCode3() { return postalCode3; }
    public void setPostalCode3(String postalCode3) { this.postalCode3 = postalCode3; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
