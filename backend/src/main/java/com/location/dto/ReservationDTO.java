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
        this.clientCIN = reservationData.get("clientCIN").toString();
        this.vehicleId = reservationData.get("vehicleId").toString();
        this.startDate = LocalDateTime.parse(reservationData.get("startDate").toString());
        this.endDate = LocalDateTime.parse(reservationData.get("endDate").toString());
        this.paidAt = LocalDateTime.parse(reservationData.get("paidAt").toString());
        this.total = new BigDecimal(reservationData.get("total").toString());
        this.paymentMethod = reservationData.get("paymentMethod").toString();
        this.paymentStatus = reservationData.get("paymentStatus").toString();
    }
}
