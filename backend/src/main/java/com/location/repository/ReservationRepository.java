package com.location.repository;

import com.location.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // method to get all reservations
    @Query("SELECT r.id, v.licensePlate, c.firstName, c.lastName, r.startDate, r.endDate " +
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