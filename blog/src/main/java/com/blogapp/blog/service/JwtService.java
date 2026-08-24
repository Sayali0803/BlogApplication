package com.blogapp.blog.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtService(
            @Value("${JWT_SECRET}") String secret,
            @Value("${JWT_EXPIRATION}") long expiration) {

        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expiration = expiration;
    }
    
    //Generate JWT

    public String generateToken(String email) {

        Date now = new Date();

        Date expiryDate =
                new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

//    Extract email from JWT
    
    public String extractEmail(String token) {
    	
    	return extractAllClaims(token)
    			.getSubject();
    }
    
//    Extract Claims
    
    public Claims extractAllClaims(String token) {
    	return Jwts.parser().verifyWith(secretKey)
    			.build()
    			.parseSignedClaims(token)
    			.getPayload();
    }
    
//    Validate JWT
    
    public boolean isTokenValid(String token, 
    		String email){

        try {

            String tokenEmail = extractEmail(token);

            return tokenEmail.equals(email)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            return false;
        }
    }

    // Check expiration
    private boolean isTokenExpired(String token) {

        Date expiration =
                extractAllClaims(token)
                        .getExpiration();

        return expiration.before(new Date());
    }
}
