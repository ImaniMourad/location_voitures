package com.location;

import com.location.repository.UsersRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LocationApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocationApplication.class, args);
    }

    // This is used to print a message on the console when the server starts
    @Bean
    CommandLineRunner runner(UsersRepository usersRepository) {
        return args -> {
            System.out.println("Server is running on port 8080");
        };
    }
    

}
