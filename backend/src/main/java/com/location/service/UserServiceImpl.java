package com.location.service;


import com.location.dto.UserDTO;
import com.location.exceptions.UserAlreadyExistsException;
import com.location.mappers.UserMapperImpl;
import com.location.model.User;
import com.location.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;


@Service
@Transactional
public class UserServiceImpl  implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapperImpl userMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public UserDTO saveUser(UserDTO userDTO) throws UserAlreadyExistsException {
        if (userRepository.findByEmail(userDTO.getEmail()) != null ) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }
        User user = userMapper.fromUserDTO(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Hashed password
        User savedUser = userRepository.save(user);
        return userMapper.fromUser(savedUser);
    }

    @Override
    public List<UserDTO> getUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.fromUserList(users);
    }

    @Override
    public void sendOTP(String to) {
        String accessKey = generateAccessKey();
        String subject = "Votre clé d'accès";
        String text = "Voici votre clé d'accès : " + accessKey;
        System.out.println("Access key: " + accessKey);
        System.out.println("Email: " + to);
        emailService.sendEmail(to, subject, text);
    }


    private String generateAccessKey() {
        return UUID.randomUUID().toString();
    }
}

