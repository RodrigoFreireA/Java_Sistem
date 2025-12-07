package com.toylog.controller;

import com.toylog.domain.Booking;
import com.toylog.dto.BookingDTO;
import com.toylog.dto.CreateBookingRequest;
import com.toylog.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingDTO> create(@Valid @RequestBody CreateBookingRequest req) {
        Booking saved = bookingService.create(req);
        BookingDTO dto = toDTO(saved);
        return ResponseEntity.created(URI.create("/api/bookings/" + saved.getId())).body(dto);
    }

    @GetMapping
    public List<BookingDTO> listAll() {
        return bookingService.listAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private BookingDTO toDTO(Booking b) {
        BookingDTO dto = new BookingDTO();
        dto.id = b.getId();
        dto.customerName = b.getCustomerName();
        dto.phone = b.getPhone();
        dto.email = b.getEmail();
        dto.eventDate = b.getEventDate();
        dto.productId = b.getProduct().getId();
        dto.productName = b.getProduct().getName();
        dto.notes = b.getNotes();
        dto.status = b.getStatus();
        dto.createdAt = b.getCreatedAt();
        return dto;
    }
}
