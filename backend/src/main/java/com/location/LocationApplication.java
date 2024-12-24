package com.location;

import com.location.dto.UserDTO;
import com.location.dto.VehicleDTO;
import com.location.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.location.service.UserService;

@SpringBootApplication
public class LocationApplication {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private UserService userService;

    public static void main(String[] args) {
        SpringApplication.run(LocationApplication.class, args);
    }

    @Bean
    CommandLineRunner runner() {
        return args -> {
            System.out.println("Server is running on port 8081");

            // Tester la méthode getVehicleById
            try {
                VehicleDTO vehicle = vehicleService.getVehicleById("ABC123"); // Exemple avec l'ID 1
                System.out.println("Vehicle retrieved: " + vehicle);
            } catch (Exception e) {
                System.err.println("Error retrieving vehicle: " + e.getMessage());
            }

            // Tester la méthode getUserByCIN
            try {
                UserDTO user = userService.getUserByCIN("AB123456");
                System.out.println("User retrieved: " + user);
            } catch (Exception e) {
                System.err.println("Error retrieving user: " + e.getMessage());
            }
        };
    }
}
