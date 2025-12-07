package com.toylog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CustomerUpdateRequest {
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
    // opcional
    public String password;
    // enderecos opcionais extra
    public String addressLine2;
    public String city2;
    public String state2;
    public String postalCode2;
    public String addressLine3;
    public String city3;
    public String state3;
    public String postalCode3;
}
