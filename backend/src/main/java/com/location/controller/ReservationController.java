package com.location.controller;

import com.location.dto.ReservationDTO;
import com.location.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);


    @GetMapping("/reservations")
    public List<Map<String, Object>> getAllReservations() {
        return reservationService.getReservations();
    }

    @GetMapping("/reservations/client/{cin}")
    public List<Map<String, Object>> getReservationsByClientCin(@PathVariable String cin) {
        return reservationService.getReservationsByClientCin(cin);
    }

    @PostMapping("/reservation")
    public ResponseEntity<Map<String, Object> > addReservation(@RequestBody Map<String, Object> reservationData) {
        try {
            ReservationDTO reservationDTO = new ReservationDTO(reservationData);
            Map<String, Object>  savedReservation = reservationService.addReservation(reservationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReservation);
        } catch (DateTimeParseException e) {
            logger.error("Date parsing error for startDate: {}, endDate: {}, paidAt: {}",
                    reservationData.get("startDate"),
                    reservationData.get("endDate"),
                    reservationData.get("paidAt"), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Error while adding reservation: {}", reservationData, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }
}