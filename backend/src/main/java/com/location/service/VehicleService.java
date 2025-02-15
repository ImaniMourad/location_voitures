package com.location.service;

import com.location.dto.VehicleDTO;
import com.location.exceptions.ImageNotValidException;
import com.location.exceptions.VehicleAlreadyExistsException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface VehicleService {
    // method to save a vehicle
    VehicleDTO saveVehicle(VehicleDTO vehicleDTO) throws VehicleAlreadyExistsException;
    // method to get all vehicles
    List<VehicleDTO> getVehicles();
    // method to get vrhicle by id
    VehicleDTO getVehicleById(String licensePlate);

    String saveImage(MultipartFile image, String licensePlate) throws IOException, ImageNotValidException;

    boolean isVehicleExists(String licensePlate);

    VehicleDTO updateVehicle(VehicleDTO vehicleDTO) throws IOException, InterruptedException;

    String getImagePath(String licensePlate);

    void deleteImage(String licensePlate);

    void archiveVehicle(String licensePlate);

    List<Map<String, Object>> getAvailableVehicles(LocalDateTime start, LocalDateTime end);

    List<Map<String, Object>> getAvailableVehiclesForUpdate(Long reservationId, LocalDateTime start, LocalDateTime end);
}
