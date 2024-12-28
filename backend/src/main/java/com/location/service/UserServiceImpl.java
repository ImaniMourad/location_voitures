package com.location.service;


import com.location.dto.UserDTO;
import com.location.dto.ClientDTO;
import com.location.exceptions.UserAlreadyExistsException;
import com.location.exceptions.UserNotExistsException;
import com.location.mappers.UserMapperImpl;
import com.location.model.Otp;
import com.location.model.User;
import com.location.model.Client;
import com.location.repository.OtpRepository;
import com.location.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    @Autowired
    private OtpRepository otpRepository;

    @Override
    public UserDTO saveUser(UserDTO userDTO) throws UserAlreadyExistsException {
        if (userRepository.findByEmail(userDTO.getEmail()) != null ) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }
        if (userRepository.findByCin(userDTO.getCin()) != null ) {
            throw new UserAlreadyExistsException("User with this CIN already exists");
        }


        if ( userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
            userDTO.setPassword(UUID.randomUUID().toString().substring(0, 8));
            String subject = "Welcome to Location App";
            String text = "Your email is " + userDTO.getEmail() + "\n" +
                    "Your password is " + userDTO.getPassword();
            emailService.sendEmail(userDTO.getEmail(), subject, text);
        }
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Hashed password
        User user = userMapper.fromUserDTO(userDTO);
        User savedUser = userRepository.save(user);
        return userMapper.fromUser(savedUser);
    }

    @Override
    public List<UserDTO> getUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.fromUserList(users);
    }

    @Override
    public String sendOTP(String to) throws UserNotExistsException {
        //verify if email exists
        User user = userRepository.findByEmail(to);
        if (user == null) {
            throw new UserNotExistsException("User with this email does not exist");
        }
        // Generate OTP
        String otp = generateOTP();

        // Save OTP in database
        Otp otpEntity = new Otp();
        otpEntity.setEmail(to);
        otpEntity.setOtp(otp);
        otpEntity.setUsed(false);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5)); // Expire in 5 minutes
        otpRepository.save(otpEntity);

        // Send OTP via email
        String subject = "Reset Your Password - OTP";
        String text = "Your OTP Code is " + otp;
        emailService.sendEmail(to, subject, text);

        return otp;
    }

    public boolean validateOTP(String email, String otp) {
        Otp otpEntity = otpRepository.findByEmailAndOtpAndUsedFalse(email, otp);

        if (otpEntity == null) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired");
        }

        // Mark OTP as used
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        return true; // OTP is valid
    }

    @Override
    public void resetPassword(String email, String password) throws UserNotExistsException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotExistsException("User with this email does not exist");
        }
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }


    private String generateOTP() {
        String otp = String.valueOf((int) (Math.random() * (999999 - 100000 + 1) + 100000));
        return  otp ;
    }

    @Override
    public UserDTO getUserByCIN(String cin) throws UserNotExistsException {
        User user = userRepository.findByCin(cin);
        if (user == null) {
            throw new UserNotExistsException("User with this CIN does not exist");
        }
        return userMapper.fromUser(user);
    }

    @Override
    public List<ClientDTO> getClients() {
        List<Client> clients = userRepository.findClients();
        return userMapper.fromClientList(clients);
    }

    @Override
    public void deleteClient(String CIN) throws UserNotExistsException {
        Client client = (Client) userRepository.findByCin(CIN);
        if (client == null) {
            throw new UserNotExistsException("Client with this CIN does not exist");
        }
        userRepository.delete(client);
    }

    @Override
    public UserDTO updateUser(String cin, UserDTO userDTO) throws UserNotExistsException, UserAlreadyExistsException {
        User user = userRepository.findByCin(cin);
        if (user == null) {
            throw new UserNotExistsException("User with this CIN does not exist");
        }

        // check  if the email is already used by another user
        if (userRepository.findByEmail(userDTO.getEmail()) != null && !userDTO.getEmail().equals(user.getEmail())) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setAddress(userDTO.getAddress());
        User updatedUser = userRepository.save(user);
        return userMapper.fromUser(updatedUser);
    }

}

