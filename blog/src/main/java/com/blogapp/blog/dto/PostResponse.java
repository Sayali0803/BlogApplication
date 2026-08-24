package com.blogapp.blog.dto;

import java.time.LocalDateTime;

public class PostResponse {

	    private Long id;
	    private String title;
	    private String content;
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
	    private UserResponseDto user;
		public PostResponse(Long id, String title, String content, LocalDateTime createdAt, LocalDateTime updatedAt,
				UserResponseDto user) {
			super();
			this.id = id;
			this.title = title;
			this.content = content;
			this.createdAt = createdAt;
			this.updatedAt = updatedAt;
			this.user = user;
		}
		public Long getId() {
			return id;
		}
		
		public String getTitle() {
			return title;
		}
		
		public String getContent() {
			return content;
		}
		
		public LocalDateTime getCreatedAt() {
			return createdAt;
		}
		
		public LocalDateTime getUpdatedAt() {
			return updatedAt;
		}
		public UserResponseDto getUser() {
			return user;
		}
		  
	    
}
