package com.location.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("client")
@Data @NoArgsConstructor @AllArgsConstructor
public class Client extends User {

    @OneToMany(mappedBy = "client")
    private List<Reservation> reservations; // Assuming Reservation is a class with appropriate fields and mappings

}
