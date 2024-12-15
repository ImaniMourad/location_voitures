package com.location.repository;

import com.location.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  VehicleRepository extends JpaRepository<Vehicle, String> {
    Vehicle findByLicensePlate(String licensePlate);

}
