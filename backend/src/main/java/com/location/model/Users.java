package com.location.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING, length = 6)
@Data @NoArgsConstructor @AllArgsConstructor
public abstract class Users {

    @Id
    @Size(min = 6, max = 15)
    private String cin;

    @NotNull
    @Size(min = 1, max = 50)
    private String firstName;

    @NotNull
    @Size(min = 1, max = 50)
    private String lastName;

    @Size(max = 255)
    private String address;

    private String dateOfBirth;

    @Size(max = 15)
    private String phoneNumber;

    @Email
    @Size(max = 100)
    private String email;

    @NotNull
    @Size(min = 6, max = 100)
    private String password;

}
