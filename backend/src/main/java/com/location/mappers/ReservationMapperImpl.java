package com.location.mappers;

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

    public List<Map<String, Object>> fromObjetList(List<Object[]> objects){
        List<Map<String, Object>> list = new ArrayList<>();
        for(Object[] obj: objects){
            list.add(fromObject(obj));
        }
        return list;
    }

    public Map<String, Object> fromObject(Object[] obj){
        Map<String, Object> map = new HashMap<>();
        map.put("id", obj[0]);
        map.put("vehicle", obj[1]);
        map.put("client", obj[2] + " " + obj[3]);
        map.put("startDate", obj[4]);
        map.put("endDate", obj[5]);
        return map;
    }

}
