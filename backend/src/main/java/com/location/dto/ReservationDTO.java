package com.location.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Data
public class ReservationDTO {
    private Long id;
    private String clientCIN;
    private String vehicleId;
    private BigDecimal total;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime deletedAt;
    private LocalDateTime paidAt;


    public ReservationDTO() {
    }

    public ReservationDTO(Map<String, Object> reservationData) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        this.clientCIN = reservationData.getOrDefault("clientCIN", "").toString();
        this.vehicleId = reservationData.getOrDefault("vehicleId", "").toString();
        this.startDate = parseDate(reservationData.get("startDate"), formatter);
        this.endDate = parseDate(reservationData.get("endDate"), formatter);
        this.paidAt = parseDate(reservationData.get("paidAt"), formatter);
        this.total = parseBigDecimal(reservationData.get("total"));
        this.paymentMethod = reservationData.getOrDefault("paymentMethod", "").toString();
        this.paymentStatus = reservationData.getOrDefault("paymentStatus", "").toString();
    }

    // Méthode utilitaire pour analyser les dates en toute sécurité
    private LocalDateTime parseDate(Object dateObj, DateTimeFormatter formatter) {
        if (dateObj == null) return null;
        try {
            return LocalDateTime.parse(dateObj.toString(), formatter);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format: " + dateObj);
        }
    }

    // Méthode utilitaire pour analyser les BigDecimal en toute sécurité
    private BigDecimal parseBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        try {
            return new BigDecimal(value.toString());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid BigDecimal format: " + value);
        }
    }
}
