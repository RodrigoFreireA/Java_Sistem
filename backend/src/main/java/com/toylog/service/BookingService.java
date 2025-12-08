package com.toylog.service;

import com.toylog.domain.Booking;
import com.toylog.domain.BookingStatus;
import com.toylog.domain.Product;
import com.toylog.dto.CreateBookingRequest;
import com.toylog.dto.UpdateBookingRequest;
import com.toylog.repository.BookingRepository;
import com.toylog.repository.ProductRepository;
import com.toylog.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.Arrays;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final UserAccountRepository userAccountRepository;
    private final ProductService productService;

    public BookingService(BookingRepository bookingRepository, ProductRepository productRepository, UserAccountRepository userAccountRepository, ProductService productService) {
        this.bookingRepository = bookingRepository;
        this.productRepository = productRepository;
        this.userAccountRepository = userAccountRepository;
        this.productService = productService;
    }

    @Transactional
    public Booking create(CreateBookingRequest req) {
        Product product = productRepository.findById(req.productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + req.productId));

        ensureAvailability(product, req.eventDate, null, BookingStatus.PENDING);

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        var customer = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        Booking booking = new Booking();
        booking.setCustomerName(customer.getName());
        booking.setPhone(customer.getPhone());
        booking.setEmail(customer.getEmail());
        booking.setEventDate(req.eventDate);
        booking.setProduct(product);
        booking.setNotes(req.notes);
        booking.setCustomer(customer);

        String useAddress = notBlank(req.addressLine) ? req.addressLine : customer.getAddressLine();
        String useCity = notBlank(req.city) ? req.city : customer.getCity();
        String useState = notBlank(req.state) ? req.state : customer.getState();
        String usePostal = notBlank(req.postalCode) ? req.postalCode : customer.getPostalCode();
        if (!notBlank(useAddress) || !notBlank(useCity) || !notBlank(useState) || !notBlank(usePostal)) {
            throw new IllegalArgumentException("Informe um endereco completo para o agendamento");
        }
        booking.setAddressLine(useAddress);
        booking.setCity(useCity);
        booking.setState(useState);
        booking.setPostalCode(usePostal);

        return bookingRepository.save(booking);
    }

    public List<Booking> listAll() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking update(UUID id, UpdateBookingRequest req) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));

        BookingStatus oldStatus = booking.getStatus();
        java.time.LocalDate oldDate = booking.getEventDate();
        var targetStatus = req.status != null ? req.status : booking.getStatus();
        var targetDate = req.eventDate != null ? req.eventDate : booking.getEventDate();

        ensureAvailability(booking.getProduct(), targetDate, booking, targetStatus);

        if (req.eventDate != null) {
            booking.setEventDate(req.eventDate);
        }
        if (req.status != null) {
            booking.setStatus(req.status);
        }
        if (req.notes != null) {
            booking.setNotes(req.notes);
        }
        Booking saved = bookingRepository.save(booking);

        // Ajusta estoque somente no momento de confirmar/cancelar
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean wasConfirmed = oldStatus == BookingStatus.CONFIRMED;
        boolean nowConfirmed = saved.getStatus() == BookingStatus.CONFIRMED;
        if (!wasConfirmed && nowConfirmed) {
            productService.decreaseStock(saved.getProduct().getId(), 1, username);
        } else if (wasConfirmed && saved.getStatus() == BookingStatus.CANCELLED) {
            productService.increaseStock(saved.getProduct().getId(), 1, username);
        }

        return saved;
    }

    public void delete(UUID id) {
        if (!bookingRepository.existsById(id)) {
            throw new EntityNotFoundException("Booking not found: " + id);
        }
        bookingRepository.deleteById(id);
    }

    public List<Booking> listMine() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        var customer = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        return bookingRepository.findByCustomerId(customer.getId());
    }

    private boolean notBlank(String v) {
        return v != null && !v.isBlank();
    }

    /**
     * Ensure product has capacity for the given date considering active bookings.
     * If updating an existing booking, it will exclude the current booking from the count when applicable.
     */
    private void ensureAvailability(Product product, java.time.LocalDate eventDate, Booking currentBooking, BookingStatus targetStatus) {
        List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.CONFIRMED);
        boolean targetIsActive = activeStatuses.contains(targetStatus);

        // If target is cancelled, no need to check capacity (it frees a slot)
        if (!targetIsActive) return;

        int activeForDate = bookingRepository.countByProductIdAndEventDateAndStatusIn(product.getId(), eventDate, activeStatuses);

        // Exclude current booking from the count if it was already active on this same date
        if (currentBooking != null
                && activeStatuses.contains(currentBooking.getStatus())
                && currentBooking.getEventDate().equals(eventDate)) {
            activeForDate -= 1;
        }

        if (activeForDate >= product.getStockQuantity()) {
            throw new IllegalArgumentException("Brinquedo sem disponibilidade na data selecionada");
        }
    }
}
