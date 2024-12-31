package com.location.repository;

import com.location.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface  VehicleRepository extends JpaRepository<Vehicle, String> {
    Vehicle findByLicensePlate(String licensePlate);

    @Query(value = "SELECT v.license_plate, v.model , v.brand , v.year , v.price , v.path_img FROM Vehicle v WHERE v.license_plate NOT IN (" +
            "SELECT r.vehicle_id FROM Reservation r WHERE " +
            "(r.start_date BETWEEN :start AND :end) OR " +
            "(r.end_date BETWEEN :start AND :end) OR " +
            "(:start BETWEEN r.start_date AND r.end_date) OR " +
            "(:end BETWEEN r.start_date AND r.end_date)" +
            ")", nativeQuery = true)
    List<Object[]> getAvailableVehicles(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);


    @Query(value = "SELECT v.license_plate, v.model , v.brand , v.year , v.price , v.path_img FROM Vehicle v WHERE v.license_plate NOT IN (" +
            "SELECT r.vehicle_id FROM Reservation r WHERE " +
            "(r.start_date BETWEEN :start AND :end) OR " +
            "(r.end_date BETWEEN :start AND :end) OR " +
            "(:start BETWEEN r.start_date AND r.end_date) OR " +
            "(:end BETWEEN r.start_date AND r.end_date)" +
            ") OR v.license_plate IN (" +
            "SELECT r.vehicle_id FROM Reservation r WHERE r.id = :reservationId" +
            ")", nativeQuery = true)
    List<Object[]> getAvailableVehiclesForUpdate(Long reservationId, LocalDateTime start, LocalDateTime end);
}