package com.blogapp.blog.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blogapp.blog.dto.CommentResponse;
import com.blogapp.blog.entity.Comment;
import com.blogapp.blog.entity.Post;
import com.blogapp.blog.entity.User;
import com.blogapp.blog.exception.ResourceNotFoundException;
import com.blogapp.blog.exception.UnauthorizedException;
import com.blogapp.blog.repository.CommentRepository;
import com.blogapp.blog.repository.PostRepository;
import com.blogapp.blog.repository.UserRepository;

@Service
public class CommentService {
	private final CommentRepository commentRepository;
	private final UserRepository userRepository;
	private final PostRepository postRepository;
	public CommentService(CommentRepository commentRepository, UserRepository userRepository,
			PostRepository postRepository) {
		super();
		this.commentRepository = commentRepository;
		this.userRepository = userRepository;
		this.postRepository = postRepository;
	}
	
	 // =====================================================
    // Get logged-in user
    // =====================================================
	
	
	private User getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder
													.getContext()
													.getAuthentication();
		
		String email = authentication.getName();
		
		return userRepository.findByEmail(email)
							.orElseThrow(() ->
									new RuntimeException("Authenticated user not found"));
	}
	
	 // =====================================================
    // CREATE COMMENT
    // =====================================================
	
	public CommentResponse createComment(Long postId, String content) {
		
		User user = getAuthenticatedUser();
		
		Post post = postRepository.findById(postId)
								.orElseThrow(() ->
										new ResourceNotFoundException("post not found"));
		
		Comment comment = new Comment();
		
		comment.setContent(content);
		comment.setPost(post);
		comment.setUser(user);
		
		Comment savedComment = commentRepository.save(comment);
		
		return convertToResponse(savedComment);
	}

	
	
	 // =====================================================
    // GET COMMENTS
    // =====================================================
	
	public List<CommentResponse> getComments(Long postId){
		
		if(!postRepository.existsById(postId)) {
			throw new ResourceNotFoundException("post not found");
		}
		
		return commentRepository
				.findByPostIdOrderByCreatedAtDesc(postId)
				.stream()
				.map(this::convertToResponse)
				.toList();
	}
	
	 // =====================================================
    // DELETE COMMENT
    // =====================================================
	
	public void deleteComment(long commentId) {
		Comment comment = commentRepository.findById(commentId)
							.orElseThrow(() -> new ResourceNotFoundException("Comment not Found"));
		
		User authenticatedUser = getAuthenticatedUser();
		//Only comment owner can delete
		
		if(!comment.getUser().getId().equals(authenticatedUser.getId())) {
			throw new UnauthorizedException("You are not allowed to delete this comment");
		}
		
		commentRepository.delete(comment);
	}
	
	 // =====================================================
    // CONVERT ENTITY TO DTO
    // =====================================================
	 private CommentResponse convertToResponse(Comment comment) {
		 return new CommentResponse(
	                comment.getId(),
	                comment.getContent(),
	                comment.getCreatedAt(),
	                comment.getUser().getId(),
	                comment.getUser().getName()
	        );
		 }
}
