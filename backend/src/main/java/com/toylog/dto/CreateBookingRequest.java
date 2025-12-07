package com.toylog.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public class CreateBookingRequest {
    @NotNull
    @Future
    public LocalDate eventDate;
    @NotNull
    public UUID productId;
    public String notes;
}
