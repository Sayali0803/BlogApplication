package com.blogapp.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.blogapp.blog.security.CustomerUserDetailsService;
import com.blogapp.blog.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

	private final CustomerUserDetailsService userDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	public SecurityConfig(CustomerUserDetailsService userDetailsService,
			JwtAuthenticationFilter jwtAuthenticationFilter) {
		super();
		this.userDetailsService = userDetailsService;
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http
				// REST API doesn't use browser sessions/CSRF
				.csrf(csrf -> csrf.disable()).userDetailsService(userDetailsService)

				.authorizeHttpRequests(auth -> auth

						// Authentication APIs are public
						.requestMatchers("/api/auth/register", "/api/auth/login").permitAll()

						// Everything else requires authentication
						.anyRequest().authenticated())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}