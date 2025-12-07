package com.toylog.dto;

import com.toylog.domain.BookingStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class BookingDTO {
    public UUID id;
    public String customerName;
    public String phone;
    public String email;
    public LocalDate eventDate;
    public UUID productId;
    public String productName;
    public String notes;
    public BookingStatus status;
    public Instant createdAt;
}
