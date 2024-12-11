package com.location.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("client")
public class Client extends Users {

    @OneToMany(mappedBy = "client")
    private List<Reservation> reservations; // Assuming Reservation is a class with appropriate fields and mappings

    public Client() {
    }

    public Client(String cin, String firstName, String lastName, String address, String dateOfBirth, String phoneNumber, List<Reservation> reservations, String email, String password) {
        super(cin, firstName, lastName, address, dateOfBirth, phoneNumber, email, password);
        this.reservations = reservations;
    }
}
