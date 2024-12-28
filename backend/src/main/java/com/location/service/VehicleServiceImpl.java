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
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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
    public VehicleDTO updateVehicle(VehicleDTO newVehicleDTO) throws IOException, InterruptedException {
        Vehicle vehicle = vehicleRepository.findByLicensePlate(newVehicleDTO.getLicensePlate());
        if (vehicle == null) {
            throw new IOException("Vehicle not found with license plate: " + newVehicleDTO.getLicensePlate());
        }

        VehicleDTO oldVehicleDTO = vehicleMapper.fromVehicle(vehicle);

        // Convert price to 2 decimal places
        BigDecimal price = new BigDecimal(newVehicleDTO.getPrice().toString()).setScale(2, BigDecimal.ROUND_HALF_UP);
        newVehicleDTO.setPrice(price);

        // Check if any updates are necessary
        if (oldVehicleDTO.equals(newVehicleDTO) && (newVehicleDTO.getPathImg() == null || newVehicleDTO.getPathImg().isEmpty())) {
            throw new IOException("No changes were made");
        }

        // Update the vehicle properties
        vehicle.setBrand(newVehicleDTO.getBrand());
        vehicle.setModel(newVehicleDTO.getModel());
        vehicle.setYear(newVehicleDTO.getYear());
        vehicle.setType(newVehicleDTO.getType());
        vehicle.setStatus(newVehicleDTO.getStatus());
        vehicle.setPrice(newVehicleDTO.getPrice());
        vehicle.setHorsePower(newVehicleDTO.getHorsePower());
        vehicle.setCapacity(newVehicleDTO.getCapacity());
        vehicle.setFeatures(newVehicleDTO.getFeatures());

        // Handle image replacement
        if (newVehicleDTO.getPathImg() != null && !newVehicleDTO.getPathImg().isEmpty()) {
            vehicle.setPathImg(newVehicleDTO.getPathImg());
        }

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.fromVehicle(updatedVehicle);
    }

    @Override
    public String getImagePath(String licensePlate) {
        Vehicle vehicle = vehicleRepository.findByLicensePlate(licensePlate);
        return vehicle.getPathImg();
    }

    @Override
    public void deleteImage(String licensePlate) {
        Vehicle vehicle = vehicleRepository.findByLicensePlate(licensePlate);
        Path ImgPath = Paths.get(vehicle.getPathImg());
        try {
            if (Files.exists(ImgPath)) Files.deleteIfExists(ImgPath);
        } catch (IOException e) {
            try {
                Thread.sleep(100);
                Files.deleteIfExists(ImgPath);
            } catch (InterruptedException | IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    @Override
    public void archiveVehicle(String licensePlate) {
        Vehicle vehicle = vehicleRepository.findByLicensePlate(licensePlate);
        vehicle.setDeletedAt(LocalDateTime.now());
        vehicleRepository.save(vehicle);
    }

    @Override
    public List<Map<String, Object>> getAvailableVehicles(LocalDateTime start, LocalDateTime end) {
        return vehicleMapper.fromObjetList(vehicleRepository.getAvailableVehicles(start, end));
    }
}
