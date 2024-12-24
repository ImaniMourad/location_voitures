package com.location.mappers;

import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;
import com.location.dto.ReservationDTO;
import com.location.model.Reservation;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationMapperImpl {

    public List<ReservationDTO> fromReservationList(List<Reservation> reservations){
        List<ReservationDTO> reservationDTOList = new ArrayList<>();
        for(Reservation reservation: reservations){
            reservationDTOList.add(fromReservation(reservation));
        }
        return reservationDTOList;
    }

    public ReservationDTO fromReservation(Reservation reservation){
        ReservationDTO reservationDTO = new ReservationDTO();
        BeanUtils.copyProperties(reservation,reservationDTO);
        return reservationDTO;
    }
}
