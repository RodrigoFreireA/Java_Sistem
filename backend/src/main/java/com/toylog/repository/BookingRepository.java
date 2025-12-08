package com.toylog.repository;

import com.toylog.domain.Booking;
import com.toylog.domain.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByCustomerId(UUID customerId);
    int countByProductIdAndEventDateAndStatusIn(UUID productId, LocalDate eventDate, List<BookingStatus> statuses);
}
