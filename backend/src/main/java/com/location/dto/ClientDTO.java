package com.location.dto;

import java.util.List;

import lombok.Data;

@Data
public class ClientDTO extends  UserDTO {
    private List<ReservationDTO> reservations;
}
