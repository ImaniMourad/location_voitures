package com.location.mappers;

import com.location.dto.VehicleDTO;
import com.location.model.Vehicle;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
}
