package com.location.repository;

import com.location.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);
    // check if a user with the given email exists ou cin exists
    @Query("SELECT u FROM User u WHERE u.email = :email OR u.cin = :cin")
    User findByEmailOrCin(String email, String cin);
    User findByEmail(String email);
}