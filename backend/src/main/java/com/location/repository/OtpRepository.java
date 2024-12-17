package com.location.repository;


import com.location.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Otp findByEmailAndOtpAndUsedFalse(String email, String otp);
    void deleteByEmail(String email); // Supprimer les anciens OTP liés à cet email
}
