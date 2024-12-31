package com.location.repository;

import com.location.model.Invoice;
import com.location.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // method to get all reservations
    @Query("SELECT r.id, c.firstName, c.lastName, r.startDate, r.endDate, v.model, v.brand , r.deletedAt " +
            "FROM Reservation r " +
            "JOIN r.vehicle v " +
            "JOIN r.client c")
    List<Object[]> getReservations();

    @Query("SELECT r.id, v.licensePlate, c.firstName, c.lastName, r.startDate, r.endDate " +
            "FROM Reservation r " +
            "JOIN r.vehicle v " +
            "JOIN r.client c " +
            "WHERE c.cin = :cin")
    List<Object[]> getReservationsByClientCin(@Param("cin") String cin);

}