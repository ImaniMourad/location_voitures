package com.location.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private LocalDateTime deletedAt;

    private LocalDateTime paidAt;


    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "client_cin", nullable = false)
    private Client client;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @JsonBackReference
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Invoice invoice;
}
