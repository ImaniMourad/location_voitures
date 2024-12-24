package com.location.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDTO {
    private Long id;
    private LocalDate startDate;
    private LocalDateTime endDate;
    private String clientCIN;
    private Long vehicleId;
    private Long invoiceId;
}
