package com.location.service;


import com.location.mappers.ReservationMapperImpl;
import com.location.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

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
}
