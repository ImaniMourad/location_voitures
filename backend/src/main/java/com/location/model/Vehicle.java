package com.location.model;

import com.location.enums.VehicleStatus ;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor
public class Vehicle {

    @Id
    private String licensePlate;

    @Size(max = 50)
    private String brand;

    @Size(max = 50)
    private String model;

    private String year;

    @Size(max = 30)
    private String type;


    @Enumerated(EnumType.STRING)
    private VehicleStatus  status;

    @Column(precision = 10, scale = 2) // pour gérer les prix numériques
    private BigDecimal price;

    @Size(max = 50)
    private String horsePower;

    @Size(max = 10)
    private String capacity;

    @Size(max = 255)
    private String features;

    @Size(max = 255)
    private String pathImg;

    @OneToMany(mappedBy = "vehicle")
    private List<Reservation> reservations;
}