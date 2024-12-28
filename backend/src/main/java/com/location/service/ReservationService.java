package com.location.service;

import com.location.dto.ReservationDTO;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ReservationService {
    // method to get all reservations
    List<Map<String, Object>> getReservations();

    List<Map<String, Object>> getReservationsByClientCin(String cin);

    ReservationDTO addReservation(ReservationDTO reservationDTO);

}
