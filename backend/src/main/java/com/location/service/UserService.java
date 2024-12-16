package com.location.service;


import com.location.dto.UserDTO;
import com.location.exceptions.UserAlreadyExistsException;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    // method to save a user
    UserDTO saveUser(UserDTO userDTO) throws UserAlreadyExistsException;

    void sendEmail(String email);
}
