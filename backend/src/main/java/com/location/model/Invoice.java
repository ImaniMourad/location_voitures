package com.location.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 10, scale = 2) // pour gérer des montants avec des décimales
    private BigDecimal amount;

    @Size(max = 50)
    private String paymentMethod;

    @Size(max = 20)
    private String paymentStatus;

    @Column(columnDefinition = "TIMESTAMP(6) without time zone")
    private LocalDateTime paymentDate;

    @OneToOne
    private Reservation reservation;
}
