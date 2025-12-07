package com.toylog.service;

import com.toylog.domain.Booking;
import com.toylog.domain.Product;
import com.toylog.dto.CreateBookingRequest;
import com.toylog.repository.BookingRepository;
import com.toylog.repository.ProductRepository;
import com.toylog.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final UserAccountRepository userAccountRepository;

    public BookingService(BookingRepository bookingRepository, ProductRepository productRepository, UserAccountRepository userAccountRepository) {
        this.bookingRepository = bookingRepository;
        this.productRepository = productRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional
    public Booking create(CreateBookingRequest req) {
        Product product = productRepository.findById(req.productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + req.productId));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        var customer = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        if (!customer.isAddressComplete()) {
            throw new IllegalArgumentException("Complete seu endereço antes de agendar");
        }

        Booking booking = new Booking();
        booking.setCustomerName(customer.getName());
        booking.setPhone(customer.getPhone());
        booking.setEmail(customer.getEmail());
        booking.setEventDate(req.eventDate);
        booking.setProduct(product);
        booking.setNotes(req.notes);
        booking.setCustomer(customer);

        return bookingRepository.save(booking);
    }

    public List<Booking> listAll() {
        return bookingRepository.findAll();
    }
}
