package com.location.service;


import com.location.dto.UserDTO;
import com.location.exceptions.UserAlreadyExistsException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    // method to save a user
    UserDTO saveUser(UserDTO userDTO) throws UserAlreadyExistsException;

    // method to get all users
    List<UserDTO> getUsers();

    void sendOTP(String to);
}
