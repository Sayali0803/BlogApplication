package com.blogapp.blog.dto;

import java.time.LocalDateTime;

import com.blogapp.blog.entity.Category;

public class PostResponse {

	    private Long id;
	    private String title;
	    private String content;
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
	    private UserResponseDto user;
	    
	    private Long categoryId;
	    private String categoryName;
	    
	    private Long likeCount;
	    private Long dislikeCount;
	    private String currentReaction;
		
		

		public PostResponse(Long id, String title, String content, LocalDateTime createdAt, LocalDateTime updatedAt,
				Long categoryId, String categoryName, Long likeCount, Long dislikeCount,
				String currentReaction,UserResponseDto user) {
			
			this.id = id;
			this.title = title;
			this.content = content;
			this.createdAt = createdAt;
			this.updatedAt = updatedAt;
			this.user = user;
			this.categoryId = categoryId;
			this.categoryName = categoryName;
			this.likeCount = likeCount;
			this.dislikeCount = dislikeCount;
			this.currentReaction = currentReaction;
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
		public Long getCategoryId() {
			return categoryId;
		}
		public void setCategoryId(Long categoryId) {
			this.categoryId = categoryId;
		}
		public String getCategoryName() {
			return categoryName;
		}
		public void setCategoryName(String categoryName) {
			this.categoryName = categoryName;
		}
		
		public Long getLikeCount() {
			return likeCount;
		}
		public void setLikeCount(Long likeCount) {
			this.likeCount = likeCount;
		}
		public Long getDislikeCount() {
			return dislikeCount;
		}
		public void setDislikeCount(Long dislikeCount) {
			this.dislikeCount = dislikeCount;
		}
		public String getCurrentReaction() {
			return currentReaction;
		}
		public void setCurrentReaction(String currentReaction) {
			this.currentReaction = currentReaction;
		}
	    
}
