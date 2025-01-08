package com.location.mappers;

import com.location.model.Client;
import com.location.repository.ReservationRepository;
import com.location.repository.UserRepository;
import com.location.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;
import com.location.dto.ReservationDTO;
import com.location.model.Reservation;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class ReservationMapperImpl {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;



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
        reservationDTO.setClientCIN(reservation.getClient().getCin());
        reservationDTO.setVehicleId(reservation.getVehicle().getLicensePlate());
        System.out.println(reservationDTO);
        return reservationDTO;
    }

    public List<Map<String, Object>> fromObjetList(List<Object[]> objects){
        List<Map<String, Object>> list = new ArrayList<>();
        for(Object[] obj: objects){
            list.add(fromObject(obj));
        }
        return list;
    }

    public Map<String, Object> fromObject(Object[] obj){
        Map<String, Object> map = new HashMap<>();
        map.put("id", obj[0] + " " + obj[1]);
        map.put("vehicle", obj[1]);
        map.put("client", obj[2] + " " + obj[3]);
        map.put("startDate", obj[4]);
        map.put("endDate", obj[5]);
        map.put("paidAt", obj[6]);
        return map;
    }

    public Reservation fromReservationDTO(ReservationDTO reservationDTO){
        Reservation reservation = new Reservation();
        reservation.setClient((Client) userRepository.findByCin(reservationDTO.getClientCIN()));
        reservation.setVehicle(vehicleRepository.findById(reservationDTO.getVehicleId()).get());
        reservation.setStartDate(reservationDTO.getStartDate());
        reservation.setEndDate(reservationDTO.getEndDate());
        reservation.setPaidAt(reservationDTO.getPaidAt());
        return reservation;
    }


}
