package com.blogapp.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.blogapp.blog.security.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

	private final CustomUserDetailsService userDetailsService;

	public SecurityConfig(CustomUserDetailsService userDetailsService) {

		this.userDetailsService = userDetailsService;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http
				// REST API doesn't use browser sessions/CSRF
				.csrf(csrf -> csrf.disable())

				.authorizeHttpRequests(auth -> auth

						// Authentication APIs are public
						.requestMatchers("/api/auth/register", "/api/auth/login").permitAll()

						// Everything else requires authentication
						.anyRequest().authenticated());

		return http.build();
	}
}