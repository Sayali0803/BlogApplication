package com.blogapp.blog.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blogapp.blog.dto.PostResponse;
import com.blogapp.blog.dto.UserResponseDto;
import com.blogapp.blog.entity.Post;
import com.blogapp.blog.entity.User;
import com.blogapp.blog.exception.ResourceNotFoundException;
import com.blogapp.blog.exception.UnauthorizedException;
import com.blogapp.blog.repository.PostRepository;
import com.blogapp.blog.repository.UserRepository;

@Service
public class PostService {

	private final PostRepository postRepository;

	private final UserRepository userRepository;

	public PostService(PostRepository postRepository, UserRepository userRepository) {
		this.postRepository = postRepository;
		this.userRepository = userRepository;
	}

	// CREATE
	public PostResponse createPost(Post post) {
//		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//		String email = authentication.getName();
//
//		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not Found!"));

		User authenticatedUser = getAuthenticatedUser();

		post.setUser(authenticatedUser);
		Post savedPost = postRepository.save(post);
		return convertToResponse(savedPost);
	}

	// READ ALL
	public List<PostResponse> getAllPosts() {
		return postRepository.findAll().stream().map(this::convertToResponse).toList();
	}

	// READ ONE
	public PostResponse getPostById(Long id) {

		Post post = postRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

		return convertToResponse(post);
	}

	// UPDATE
	public PostResponse updatePost(Long id, Post updatedPost) {

		Post existingPost = postRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

		User authenticatedUser = getAuthenticatedUser();

//		Check ownership
		if (!existingPost.getUser().getId().equals(authenticatedUser.getId())) {

			throw new UnauthorizedException("You are not allowed to update this post");
		}

		existingPost.setTitle(updatedPost.getTitle());
		existingPost.setContent(updatedPost.getContent());

		Post post = postRepository.save(existingPost);
		return convertToResponse(post);
	}

	// DELETE
	public void deletePost(Long id) {

//		if (!postRepository.existsById(id)) {
//			throw new RuntimeException("Post not found with id: " + id);
//		}
		Post existingPost = postRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
		User authenticatedUser = getAuthenticatedUser();

//		Check ownership
		if (!existingPost.getUser().getId().equals(authenticatedUser.getId())) {

			throw new UnauthorizedException("You are not allowed to delete this post");
		}
//		postRepository.deleteById(id);
		postRepository.delete(existingPost);
	}

	// SEARCH BY TITLE
	public List<PostResponse> searchPosts(String keyword) {
		return postRepository.findByTitleContainingIgnoreCase(keyword).stream().map(this::convertToResponse).toList();
	}

	private User getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();

		return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not Found!"));

	}

	private PostResponse convertToResponse(Post post) {

		UserResponseDto userResponse = new UserResponseDto(post.getUser().getId(), post.getUser().getName(),
				post.getUser().getEmail());

		return new PostResponse(post.getId(), post.getTitle(), post.getContent(), post.getCreatedAt(),
				post.getUpdatedAt(), userResponse);
	}
}