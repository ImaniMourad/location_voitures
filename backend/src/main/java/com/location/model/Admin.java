package com.location.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;


@Entity
@DiscriminatorValue("admin")
public class Admin extends Users {

    public Admin() {
    }

    public Admin(String cin, String firstName, String lastName, String address, String dateOfBirth, String phoneNumber, String email, String password) {
        super(cin, firstName, lastName, address, dateOfBirth, phoneNumber, email, password);
    }


}
