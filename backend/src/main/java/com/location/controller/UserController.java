package com.location.controller;

import com.location.config.JwtConfig;
import com.location.dto.ClientDTO;
import com.location.dto.UserDTO;
import com.location.exceptions.UserAlreadyExistsException;
import com.location.exceptions.UserNotExistsException;
import com.location.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtConfig jwtConfig;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody ClientDTO userDTO) {
        try {
            logger.info("Registering user: {}", userDTO);
            ClientDTO savedUser = userService.saveUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            logger.error("Error registering user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/client")
    public ResponseEntity<?> addUser(@RequestBody ClientDTO userDTO) {
        try {
            System.out.println(userDTO);
            logger.info("Adding user: {}", userDTO.getEmail());
            ClientDTO savedUser = userService.saveUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch ( UserAlreadyExistsException e) {
            logger.error("User already exists", e);
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error adding user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PutMapping("/user/{CIN}")
    public ResponseEntity<?> updateUser(@PathVariable String CIN, @RequestBody UserDTO userDTO) {
        try {
            logger.info("Updating user with CIN: {}", CIN);
            UserDTO updatedUser = userService.updateUser(CIN, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (UserNotExistsException e) {
            logger.error("No user found with CIN: {}", CIN);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    

    @GetMapping("/auth/verify-token")
    public ResponseEntity<?> verifyToken(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null && jwtConfig.validateToken(token)) {
            logger.info("Token is valid");
            return ResponseEntity.ok().build();
        } else {
            logger.warn("Token is invalid");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    //send email when user forgets password
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendEmail(@RequestParam String email) {
        try {
            logger.info("Sending email to user: {}", email);
            String otp = userService.sendOTP(email);
            return ResponseEntity.ok(otp);
        } catch (UserNotExistsException e) {
            logger.error("No user found with email: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error sending email", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("User/{CIN}")
    public ResponseEntity<?> getUserByCIN(@PathVariable String CIN) {
        try {
            logger.info("Getting user with CIN: {}", CIN);
            UserDTO user = userService.getUserByCIN(CIN);
            return ResponseEntity.ok(user);
        } catch (UserNotExistsException e) {
            logger.error("No user found with CIN: {}", CIN);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error getting user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestParam String email, @RequestParam String otp) {
        try {
            userService.validateOTP(email, otp);
            return ResponseEntity.ok("OTP verified successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String password) {
        try {
            userService.resetPassword(email, password);
            return ResponseEntity.ok("Password reset successfully");
        } catch (UserNotExistsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.replace("Bearer ", "");
        }
        return null;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    @GetMapping("/clients")
    public ResponseEntity<?> getClients() {
        return ResponseEntity.ok(userService.getClients());
    }

    @DeleteMapping("/client/{CIN}")
    public ResponseEntity<?> deleteClient(@PathVariable String CIN) {
        try {
            userService.deleteClient(CIN);
            return ResponseEntity.ok("Client deleted successfully");
        } catch (UserNotExistsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    @PutMapping("/client/{CIN}/archive")
    public ResponseEntity<?> archiveClient(@PathVariable String CIN) {
        try {
            userService.archiveClient(CIN);
            return ResponseEntity.ok("Client archived successfully");
        } catch (UserNotExistsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}