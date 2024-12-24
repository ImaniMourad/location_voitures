package com.location.service;

import com.location.dto.ReservationDTO;
import java.util.List;

public interface ReservationService {
    // method to get all reservations
    List<ReservationDTO> getReservations();
}
