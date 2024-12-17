package com.location.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Otp {
    @Id
    private String email; // user email
    private String otp; // Code OTP
    private boolean used; // if the OTP is used
    private LocalDateTime expiresAt; // Expiration date
}
