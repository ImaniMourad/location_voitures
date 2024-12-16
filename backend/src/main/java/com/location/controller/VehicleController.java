package com.location.controller;

import com.location.dto.VehicleDTO;
import com.location.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/vehicles")
    public ResponseEntity<?> getVehicles() {
        return ResponseEntity.ok(vehicleService.getVehicles());
    }
}
