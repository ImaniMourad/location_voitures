package com.location.service;

import com.location.dto.VehicleDTO;
import com.location.exceptions.ImageNotValidException;
import com.location.exceptions.VehicleAlreadyExistsException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface VehicleService {
    // method to save a vehicle
    VehicleDTO saveVehicle(VehicleDTO vehicleDTO) throws VehicleAlreadyExistsException;
    // method to get all vehicles
    List<VehicleDTO> getVehicles();
    // method to get vrhicle by id
    VehicleDTO getVehicleById(String licensePlate);
    // method to delete a vehicle
    void deleteVehicle(String licensePlate);

    String saveImage(MultipartFile image, String licensePlate) throws IOException, ImageNotValidException;

    boolean isVehicleExists(String licensePlate);

    VehicleDTO updateVehicle(VehicleDTO vehicleDTO) throws IOException, InterruptedException;

    String getImagePath(String licensePlate);

    void deleteImage(String licensePlate);
}
