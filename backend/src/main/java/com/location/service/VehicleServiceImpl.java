package com.location.service;

import com.location.dto.VehicleDTO;
import com.location.exceptions.VehicleAlreadyExistsException;
import com.location.mappers.VehicleMapperImpl;
import com.location.model.Vehicle;
import com.location.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleMapperImpl vehicleMapper;

    @Override
    public VehicleDTO saveVehicle(VehicleDTO vehicleDTO) throws VehicleAlreadyExistsException {
        if (vehicleRepository.findByLicensePlate(vehicleDTO.getLicensePlate()) != null) {
            throw new VehicleAlreadyExistsException("Vehicle with this registration number already exists");
        }
        Vehicle vehicle = vehicleMapper.fromVehicleDTO(vehicleDTO);
        System.out.println("Vehicle: " + vehicle);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.fromVehicle(savedVehicle);
    }

    @Override
    public List<VehicleDTO> getVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return vehicleMapper.fromVehicleList(vehicles);
    }

}
