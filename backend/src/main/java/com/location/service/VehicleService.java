package com.location.service;

import com.location.dto.VehicleDTO;
import com.location.exceptions.VehicleAlreadyExistsException;

import java.util.List;

public interface VehicleService {
    // method to save a vehicle
    VehicleDTO saveVehicle(VehicleDTO vehicleDTO) throws VehicleAlreadyExistsException;
    // method to get all vehicles
    List<VehicleDTO> getVehicles();
    // method to get vrhicle by id
    VehicleDTO getVehicleById(String licensePlate);
}
