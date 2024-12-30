package com.location.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("client")
@Data @NoArgsConstructor @AllArgsConstructor
public class Client extends User {

    @ToString.Exclude
    @JsonManagedReference
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<Reservation> reservations;

    @Nullable
    private LocalDateTime deletedAt;

}