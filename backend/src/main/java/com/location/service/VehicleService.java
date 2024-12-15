package com.location.service;

import com.location.dto.VehicleDTO;
import com.location.exceptions.VehicleAlreadyExistsException;

public interface VehicleService {
    // method to save a vehicle
    VehicleDTO saveVehicle(VehicleDTO vehicleDTO) throws VehicleAlreadyExistsException;
}
