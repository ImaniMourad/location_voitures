package com.location.controller;

import com.location.dto.ReservationDTO;
import com.location.model.Reservation;
import com.location.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);


    @GetMapping("/reservations")
    public List<Map<String, Object>> getReservations() {
        return reservationService.getReservations();
    }

    @GetMapping("/reservations/client/{cin}")
    public List<Map<String, Object>> getReservationsByClientCin(@PathVariable String cin) {
        return reservationService.getReservationsByClientCin(cin);
    }

    @PostMapping("/client/reservation")
    public ResponseEntity<Map<String, Object> > addReservationforclient(@RequestBody Map<String, Object> reservationData) {
        try {
            ReservationDTO reservationDTO = new ReservationDTO(reservationData);
            Map<String, Object>  savedReservation = reservationService.addReservationclient(reservationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReservation);
        } catch (DateTimeParseException e) {
            logger.error("Date parsing error for startDate: {}, endDate: {}",
                    reservationData.get("startDate"),
                    reservationData.get("endDate"), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Error while adding reservation: {}", reservationData, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }


    @PostMapping("/reservation")
    public ResponseEntity<Map<String, Object>> addReservation(@RequestBody Map<String, Object> reservationData) {
        try {
            // Convert reservationData to a DTO
            ReservationDTO reservationDTO = new ReservationDTO(reservationData);

            // Add the reservation using the service
            Map<String, Object> savedReservation = reservationService.addReservation(reservationDTO);
            Reservation reservation = (Reservation) savedReservation.get("reservation");

            // annuler la réservation pour les autres utilisateurs
            reservationService.cancelReservationForOthers(reservation.getId());

            // Return the saved reservation as a response
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

    @PutMapping("/reservation/{reservationId}")
    public ResponseEntity<Map<String, Object>> updateReservation(@PathVariable Long reservationId, @RequestBody Map<String, Object> reservationData) {
        try {
            ReservationDTO reservationDTO = new ReservationDTO(reservationData);
            Map<String, Object> updatedReservation = reservationService.updateReservation(reservationId, reservationDTO);
            return ResponseEntity.ok(updatedReservation);
        } catch (DateTimeParseException e) {
            logger.error("Date parsing error for startDate: {}, endDate: {}, paidAt: {}",
                    reservationData.get("startDate"),
                    reservationData.get("endDate"),
                    reservationData.get("paidAt"), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Error while updating reservation with id: {}", reservationId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/reservation/{reservationId}")
    public Map<String, String> getReservation(@PathVariable Long reservationId) {
       try {
           return reservationService.getReservation(reservationId);
       } catch (Exception e) {
           logger.error("Error while getting reservation with id: {}", reservationId, e);
           return null;
       }
    }

    @PutMapping("/reservations/{id}/archive")
    public ResponseEntity<?> archiveReservation(@PathVariable Long id) {
        try {
            reservationService.archiveReservation(id);
            return ResponseEntity.ok("Reservation archived successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/reservation/{id}/cancel")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.cancelReservation(id);
            return ResponseEntity.ok("Reservation deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/client/reservation/{licensePlate}/{cin}")
    public ResponseEntity<?> isClientReservingVehicle(@PathVariable String licensePlate, @PathVariable String cin) {
        try {
            Map<String, Object> reservation = reservationService.isClientReservingVehicle(cin, licensePlate);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}