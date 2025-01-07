package com.location.repository;

import com.location.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;


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

    @Query(value = "SELECT EXTRACT(MONTH FROM r.start_date) AS month, SUM(v.price) AS income FROM reservation r, vehicle v WHERE v.license_plate = r.vehicle_id GROUP BY month ORDER BY month", nativeQuery = true)
    List<Map<String, Object>> getIncomeByMonth();

    // month days
    @Query(value = "SELECT EXTRACT(MONTH FROM r.start_date) AS month, COUNT(*) AS days FROM reservation r GROUP BY month ORDER BY month", nativeQuery = true)
    List<Map<String, Object>> getVehicleRotation();
}
