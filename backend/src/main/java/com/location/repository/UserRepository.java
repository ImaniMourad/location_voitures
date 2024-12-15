package com.location.repository;

import com.location.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserRepository extends JpaRepository<User, String> {
    // check if a user with the given email exists
    User findByEmail(String email);
    @Query("SELECT u.class FROM User u WHERE u.email = :email")
    Class findUserTypeByEmail(@Param("email") String email);
}