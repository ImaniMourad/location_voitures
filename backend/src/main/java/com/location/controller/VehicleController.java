package com.location.controller;

import com.location.dto.VehicleDTO;
import com.location.exceptions.ImageNotValidException;
import com.location.exceptions.VehicleAlreadyExistsException;
import com.location.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;

@RestController
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @PostMapping("/addVehicle")
    public ResponseEntity<?> addVehicle(@RequestBody VehicleDTO vehicleDTO) {
        try {
            VehicleDTO savedVehicle = vehicleService.saveVehicle(vehicleDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVehicle);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/vehicle/{licensePlate}")
    public ResponseEntity<?> getVehicleById(@PathVariable String licensePlate) {
        return ResponseEntity.ok(vehicleService.getVehicleById(licensePlate));
    }

    @GetMapping("/vehicles")
    public ResponseEntity<?> getVehicles() {
        return ResponseEntity.ok(vehicleService.getVehicles());
    }

    @PostMapping("/vehicles")
    public ResponseEntity<?> addVehicle(
            @RequestParam("licensePlate") String licensePlate,
            @RequestParam("brand") String brand,
            @RequestParam("model") String model,
            @RequestParam("year") String year,
            @RequestParam("type") String type,
            @RequestParam("status") String status,
            @RequestParam("price") BigDecimal price,
            @RequestParam("horsePower") String horsePower,
            @RequestParam("capacity") String capacity,
            @RequestParam("image") MultipartFile image) {
        try {
            if( vehicleService.isVehicleExists(licensePlate) ) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Vehicle with this license plate already exists");
            }
            String pathImg = vehicleService.saveImage(image, licensePlate);

            VehicleDTO vehicleDTO = new VehicleDTO(
                    licensePlate, brand, model, year, type, status, price, horsePower, capacity,
                    new ArrayList<>(), pathImg
            );

            // Save the vehicle and return the saved object
            VehicleDTO savedVehicle = vehicleService.saveVehicle(vehicleDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVehicle);

        } catch (ImageNotValidException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid image");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving the image");
        } catch (VehicleAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("License Plate already exists");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }


    @DeleteMapping("/vehicle/{licensePlate}")
    public ResponseEntity<?> deleteVehicle(@PathVariable String licensePlate) {
        try {
            vehicleService.deleteVehicle(licensePlate);
            return ResponseEntity.ok("Vehicle deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
