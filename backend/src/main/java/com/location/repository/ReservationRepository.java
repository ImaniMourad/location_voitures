package com.location.repository;

import com.location.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // method to get all reservations
    @Query("SELECT r.id, c.firstName, c.lastName, r.startDate, r.endDate, v.model, v.brand , r.deletedAt , r.paidAt " +
            "FROM Reservation r " +
            "JOIN r.vehicle v " +
            "JOIN r.client c")
    List<Object[]> getReservations();

    @Query("SELECT v.brand, v.model, c.firstName, c.lastName, r.startDate, r.endDate , r.paidAt, r.id " +
            "FROM Reservation r " +
            "JOIN r.vehicle v " +
            "JOIN r.client c " +
            "WHERE c.cin = :cin AND r.deletedAt IS NULL")
    List<Object[]> getReservationsByClientCin(@Param("cin") String cin);


    // get client who reserved the same vehicle in the same period a partir de l'id de la reservation et startDate et endDate utliser native query
    @Query(value = "SELECT c.first_name , c.last_name, c.email, r.start_date, r.end_date " +
            "FROM reservation r " +
            "JOIN users c ON r.client_cin = c.cin " +
            "WHERE r.vehicle_id = (SELECT vehicle_id FROM reservation WHERE id = :idreservation) " +
            "AND r.start_date <= (SELECT end_date FROM reservation WHERE id = :idreservation) " +
            "AND r.end_date >= (SELECT start_date FROM reservation WHERE id = :idreservation) " +
            "AND r.id != :idreservation", nativeQuery = true)
    List<Object> getClientReservedSameVehicleInSamePeriod(Long idreservation);


    // get vehicle by reservation id
    @Query("SELECT r.vehicle FROM Reservation r WHERE r.id = :idreservation")
    Vehicle getVehicleByReservationId(Long idreservation);

    // get start date by reservation id
    @Query("SELECT r.startDate FROM Reservation r WHERE r.id = :idreservation")
    LocalDateTime getStartDateByReservationId(Long idreservation);

    // get end date by reservation id
    @Query("SELECT r.endDate FROM Reservation r WHERE r.id = :idreservation")
    LocalDateTime getEndDateByReservationId(Long idreservation);

    // get reservation by vehicle id and date
    @Query("SELECT r FROM Reservation r WHERE r.vehicle.licensePlate = :licensePlate AND r.id != :idreservation AND r.startDate <= :endDateTime AND r.endDate >= :startDateTime")
    List<Reservation> getReservationByVehicleIdAndDate(String licensePlate, Long idreservation, LocalDateTime startDateTime, LocalDateTime endDateTime);
}