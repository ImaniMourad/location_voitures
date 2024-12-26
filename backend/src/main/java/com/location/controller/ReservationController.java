package com.location.controller;

import com.location.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/reservations")
    public List<Map<String, Object>> getAllReservations() {
        return reservationService.getReservations();
    }

    @GetMapping("/reservations/client/{cin}")
    public List<Map<String, Object>> getReservationsByClientCin(@PathVariable String cin) {
        return reservationService.getReservationsByClientCin(cin);
    }
}