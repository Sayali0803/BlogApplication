package com.blogapp.blog.dto;

import java.time.LocalDateTime;

public class CommentResponse {
	private Long id;
	private String content;
	private LocalDateTime createdAt;

	private Long userId;
	private String userName;

	public CommentResponse(Long id, String content, LocalDateTime createdAt, Long userId, String userName) {
		super();
		this.id = id;
		this.content = content;
		this.createdAt = createdAt;
		this.userId = userId;
		this.userName = userName;
	}

	public Long getId() {
		return id;
	}

	public String getContent() {
		return content;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public Long getUserId() {
		return userId;
	}

	public String getUserName() {
		return userName;
	}

}
