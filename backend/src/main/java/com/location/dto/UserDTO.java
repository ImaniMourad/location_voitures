package com.location.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String cin;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String password;
}
