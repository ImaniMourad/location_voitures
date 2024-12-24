package com.location.service;


import com.location.dto.ReservationDTO;
import com.location.model.Reservation;
import com.location.mappers.ReservationMapperImpl;
import com.location.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.location.dto.ReservationDTO;
import java.util.List;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationMapperImpl reservationMapper;

    @Override
    public List<ReservationDTO> getReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return reservationMapper.fromReservationList(reservations);
    }
}
