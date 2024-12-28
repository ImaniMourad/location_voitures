package com.location.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ClientDTO extends UserDTO {
    private List<ReservationDTO> reservations;
    private LocalDateTime deletedAt;
}
