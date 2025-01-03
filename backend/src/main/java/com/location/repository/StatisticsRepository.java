package com.location.repository;

import com.location.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface StatisticsRepository extends JpaRepository<Vehicle, String> {
    @Query(value = "SELECT SUM(v.price) FROM reservation r, vehicle v WHERE v.license_plate = r.vehicle_id", nativeQuery = true)
    double getTotalIncome();

    @Query(value = "SELECT COUNT(*) FROM reservation", nativeQuery = true)
    int getReservations();

    @Query(value = "SELECT COUNT(*) FROM vehicle v WHERE v.status = 'AVAILABLE'", nativeQuery = true)
    int getAvailableVehicles();

    @Query(value = "SELECT (SUM(EXTRACT(EPOCH FROM AGE(end_date, start_date)) / 86400) / ((SELECT COUNT(*) FROM vehicle) * 30)) * 100 AS occupancy_rate FROM reservation", nativeQuery = true)
    double getOccupancyRate();

}
