package com.location.controller;

import com.location.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/totalIncome")
    public ResponseEntity<?> getTotalIncome() {
        return ResponseEntity.ok(statisticsService.getTotalIncome());
    }

    @GetMapping("/reservations")
    public ResponseEntity<?> getReservations() {
        return ResponseEntity.ok(statisticsService.getReservations());
    }

    @GetMapping("/activeVehicles")
    public ResponseEntity<?> getActiveVehicles() {
        return ResponseEntity.ok(statisticsService.getActiveVehicles());
    }

    @GetMapping("/occupancyRate")
    public ResponseEntity<?> getOccupancyRate() {
        return ResponseEntity.ok(statisticsService.getOccupancyRate());
    }

    @GetMapping("/monthlyIncome")
    public ResponseEntity<?> getMonthlyIncome() {
        return ResponseEntity.ok(statisticsService.getMonthlyIncome());
    }

    @GetMapping("/vehicleRotation")
    public ResponseEntity<?> getVehicleRotation() {
        return ResponseEntity.ok(statisticsService.getVehicleRotation());
    }
}
