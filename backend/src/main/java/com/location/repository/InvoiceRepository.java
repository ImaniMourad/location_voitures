package com.location.repository;

import com.location.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice , Long> {
    Invoice findByReservationId(Long reservationId);
}
