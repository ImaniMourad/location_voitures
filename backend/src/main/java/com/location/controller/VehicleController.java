package com.location.controller;

import com.location.dto.VehicleDTO;
import com.location.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @PostMapping("/addVehicle")
    public ResponseEntity<?> addVehicle(@RequestBody VehicleDTO vehicleDTO) {
        try {
            System.out.println("VehicleDTO: " + vehicleDTO);
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
