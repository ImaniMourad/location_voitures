package com.location.dto;

import java.util.List;

import lombok.Data;

@Data
public class ClientDTO {
    private String cin;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private List<ReservationDTO> reservations;

}
