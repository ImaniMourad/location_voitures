package com.location.service;

import com.location.model.User;
import com.location.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // get user type
        Class<?> className = userRepository.findUserTypeByEmail(email);
        String userType = className.getSimpleName();
        System.out.println("User type: " + userType);

        // add role to user
        GrantedAuthority authority = new SimpleGrantedAuthority(userType);

        return new org.springframework.security.core.userdetails.User(user.getCin(), user.getPassword(), Collections.singleton(authority));
    }
}