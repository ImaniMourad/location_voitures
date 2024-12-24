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
        };
    }
}
