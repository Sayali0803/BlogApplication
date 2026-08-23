package com.blogapp.blog.dto;

public class LoginResponse {

    private String token;
    private String tokenType;
    private String name;
    private String email;

    public LoginResponse(
            String token,
            String tokenType,
            String name,
            String email) {

        this.token = token;
        this.tokenType = tokenType;
        this.name = name;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}