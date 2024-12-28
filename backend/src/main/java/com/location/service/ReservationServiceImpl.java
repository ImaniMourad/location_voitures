package com.location.service;


import com.location.dto.ReservationDTO;
import com.location.mappers.ReservationMapperImpl;
import com.location.mappers.VehicleMapperImpl;
import com.location.model.Reservation;
import com.location.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationMapperImpl reservationMapper;


    @Override
    public List<Map<String, Object>> getReservations() {
        return reservationMapper.fromObjetList(reservationRepository.getReservations());
    }

    @Override
    public List<Map<String, Object>> getReservationsByClientCin(String cin) {
        return reservationMapper.fromObjetList(reservationRepository.getReservationsByClientCin(cin));
    }

    @Override
    public ReservationDTO addReservation(ReservationDTO reservationDTO) {
        Reservation reservation = reservationMapper.fromReservationDTO(reservationDTO);
        reservation = reservationRepository.save(reservation);
        return reservationMapper.fromReservation(reservation);
    }
}
