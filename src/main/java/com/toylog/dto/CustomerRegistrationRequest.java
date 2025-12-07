package com.toylog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CustomerRegistrationRequest {
    @NotBlank
    public String username;
    @NotBlank
    public String password;
    @NotBlank
    public String name;
    @NotBlank
    public String phone;
    @Email
    public String email;
    @NotBlank
    public String addressLine;
    @NotBlank
    public String city;
    @NotBlank
    public String state;
    @NotBlank
    public String postalCode;
}
