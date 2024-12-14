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


@Service
@Transactional
public class UserServiceImpl  implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapperImpl userMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserDTO saveUser(UserDTO userDTO) throws UserAlreadyExistsException {
        if (userRepository.findByEmailOrCin(userDTO.getEmail() , userDTO.getCin()) != null) {
            throw new UserAlreadyExistsException("User with this email or cin already exists");
        }
        User user = userMapper.fromUserDTO(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Hashed password
        User savedUser = userRepository.save(user);
        return userMapper.fromUser(savedUser);
    }
}

