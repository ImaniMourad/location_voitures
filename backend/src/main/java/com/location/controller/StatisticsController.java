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

    @GetMapping("/availableVehicles")
    public ResponseEntity<?> getAvailableVehicles() {
        return ResponseEntity.ok(statisticsService.getAvailableVehicles());
    }

    @GetMapping("/occupancyRate")
    public ResponseEntity<?> getOccupancyRate() {
        return ResponseEntity.ok(statisticsService.getOccupancyRate());
    }

    @GetMapping("/monthlyIncome")
    public ResponseEntity<?> getIncomeByMonth() {
        return ResponseEntity.ok(statisticsService.getIncomeByMonth());
    }

    @GetMapping("/vehicleRotation")
    public ResponseEntity<?> getVehicleRotation() {
        return ResponseEntity.ok(statisticsService.getVehicleRotation());
    }
}
