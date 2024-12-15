package com.location.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import io.jsonwebtoken.*;

import org.springframework.stereotype.Component;
import java.util.Date;

@Configuration
@Component
public class JwtConfig {

    @Getter
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    // Générer un token
    public String generateToken(String username , String userType) {
        return Jwts.builder()
                .setSubject(username)
                .claim("user_type", userType)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    // Extract username from token
    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token expiré");
        } catch (MalformedJwtException e) {
            System.out.println("Token mal formé");
        } catch (SignatureException e) {
            System.out.println("Signature invalide");
        } catch (Exception e) {
            System.out.println("Erreur de validation du token");
        }
        return false;
    }
}
