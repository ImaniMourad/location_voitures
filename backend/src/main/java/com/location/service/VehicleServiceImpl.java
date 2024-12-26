package com.location.service;

import com.location.dto.VehicleDTO;
import com.location.exceptions.ImageNotValidException;
import com.location.exceptions.VehicleAlreadyExistsException;
import com.location.mappers.VehicleMapperImpl;
import com.location.model.Vehicle;
import com.location.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;


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
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.fromVehicle(savedVehicle);
    }

    @Override
    public List<VehicleDTO> getVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return vehicleMapper.fromVehicleList(vehicles);
    }

    @Override
    public VehicleDTO getVehicleById(String licensePlate) {
        Vehicle vehicle = vehicleRepository.findByLicensePlate(licensePlate);
        return vehicleMapper.fromVehicle(vehicle);
    }

    @Override
    public void deleteVehicle(String licensePlate) {
        Vehicle vehicle = vehicleRepository.findByLicensePlate(licensePlate);
        vehicleRepository.delete(vehicle);
    }

    @Override
    public String saveImage(MultipartFile image, String licensePlate) throws IOException, ImageNotValidException {
        if (image.isEmpty()) {
            throw new ImageNotValidException("Image is not valid");
        }

        // Define the directory where images will be stored
        String uploadDir = "src/main/resources/uploads";

        // Construct the filename using licensePlate
        String originalFilename = image.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new ImageNotValidException("Invalid image file name.");
        }

        String newFilename = licensePlate + "_" + originalFilename; // Corrected concatenation
        Path filePath = Paths.get(uploadDir, newFilename);

        // Ensure the directory exists
        Files.createDirectories(filePath.getParent());

        // Save the image
        Files.copy(image.getInputStream(), filePath);

        return filePath.toString();
    }

    @Override
    public boolean isVehicleExists(String licensePlate) {
        return vehicleRepository.findByLicensePlate(licensePlate) != null;
    }

    @Override
    public VehicleDTO updateVehicle(VehicleDTO vehicleDTO) {
        // utliser dto pour mettre à jour les données
        Vehicle vehicle = vehicleRepository.findByLicensePlate(vehicleDTO.getLicensePlate());
        vehicle.setBrand(vehicleDTO.getBrand());
        vehicle.setModel(vehicleDTO.getModel());
        vehicle.setYear(vehicleDTO.getYear());
        vehicle.setType(vehicleDTO.getType());
        vehicle.setStatus(vehicleDTO.getStatus());
        vehicle.setPrice(vehicleDTO.getPrice());
        vehicle.setHorsePower(vehicleDTO.getHorsePower());
        vehicle.setCapacity(vehicleDTO.getCapacity());
        vehicle.setFeatures(vehicleDTO.getFeatures());
        if (!Objects.equals(vehicleDTO.getPathImg(), "")) vehicle.setPathImg(vehicleDTO.getPathImg());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.fromVehicle(updatedVehicle);
    }


}
