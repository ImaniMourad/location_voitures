package com.location.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @Size(max = 15)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(precision = 10, scale = 2) // pour gérer les prix numériques
    private BigDecimal price;

    @Size(max = 50)
    private String horsePower;

    @Size(max = 10)
    private String capacity;

    @ElementCollection
    private List<String> features;

    @Size(max = 255)
    private String pathImg;

    @OneToMany(mappedBy = "vehicle")
    private List<Reservation> reservations;
}
