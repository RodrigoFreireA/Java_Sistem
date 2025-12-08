package com.toylog.dto;

import com.toylog.domain.BookingStatus;
import jakarta.validation.constraints.Future;

import java.time.LocalDate;

public class UpdateBookingRequest {
    @Future
    public LocalDate eventDate;
    public BookingStatus status;
    public String notes;
}
