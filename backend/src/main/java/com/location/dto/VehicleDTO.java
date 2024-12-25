package com.location.dto;

import com.location.enums.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleDTO {

    private String licensePlate; // Vehicle's unique identifier
    private String brand;        // Vehicle brand
    private String model;        // Vehicle model
    private String year;         // Manufacturing year
    private String type;         // Type of vehicle (e.g., Sedan, Hatchback)
    private String status; // Availability status
    private BigDecimal price;    // Price of the vehicle
    private String horsePower;   // Vehicle's horsepower
    private String capacity;     // Capacity (e.g., number of seats)
    private List<String> features; // List of additional features (e.g., Bluetooth, Sunroof)
    private String pathImg;      // Path to the image of the vehicle

    // No reservation details to keep the DTO lightweight
}
