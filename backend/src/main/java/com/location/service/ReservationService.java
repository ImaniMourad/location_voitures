package com.location.service;

import com.location.dto.ReservationDTO;
import org.springframework.data.jpa.repository.Query;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface ReservationService {
    // method to get all reservations
    List<Map<String, Object>> getReservations();

    List<Map<String, Object>> getReservationsByClientCin(String cin);

    Map<String, Object> addReservation(ReservationDTO reservationDTO);

    Map<String, String> getReservation(Long reservationId);

    Map<String, Object> updateReservation(Long reservationId, ReservationDTO reservationDTO);

    void archiveReservation(Long reservationId);

    Map<String, Object> addReservationclient(ReservationDTO reservationDTO);

    void cancelReservationForOthers(Long idreservation);
}
