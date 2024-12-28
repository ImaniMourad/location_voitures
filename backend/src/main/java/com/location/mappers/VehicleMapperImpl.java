package com.location.mappers;

import com.location.dto.VehicleDTO;
import com.location.model.Vehicle;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VehicleMapperImpl {

    public VehicleDTO fromVehicle(Vehicle vehicle){
        VehicleDTO vehicleDTO = new VehicleDTO();
        BeanUtils.copyProperties(vehicle,vehicleDTO);
        return vehicleDTO;
    }

    public Vehicle fromVehicleDTO(VehicleDTO vehicleDTO){
        Vehicle vehicle = new Vehicle();
        BeanUtils.copyProperties(vehicleDTO,vehicle);
        return vehicle;
    }

    public List<VehicleDTO> fromVehicleList(List<Vehicle> vehicles){
        List<VehicleDTO> vehicleDTOList = new ArrayList<>();
        for(Vehicle vehicle: vehicles){
            vehicleDTOList.add(fromVehicle(vehicle));
        }
        return vehicleDTOList;
    }

    public List<Map<String, Object>> fromObjetList(List<Object[]> availableVehicles) {
        List<Map<String, Object>> list = new ArrayList<>();
        for(Object[] obj: availableVehicles){
            list.add(fromObject(obj));
        }
        return list;
    }

    private Map<String, Object> fromObject(Object[] obj) {
        Map<String, Object> map = new HashMap<>();
        map.put("licensePlate", obj[0]);
        map.put("model", obj[1]);
        map.put("brand", obj[2]);
        map.put("year", obj[3]);
        map.put("price", obj[4]);
        return map;
    }
}
