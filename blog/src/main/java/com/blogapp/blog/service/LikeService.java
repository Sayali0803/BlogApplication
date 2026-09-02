package com.blogapp.blog.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blogapp.blog.dto.LikeResponse;
import com.blogapp.blog.entity.Post;
import com.blogapp.blog.entity.PostLike;
import com.blogapp.blog.entity.User;
import com.blogapp.blog.exception.ResourceNotFoundException;
import com.blogapp.blog.repository.PostLikeRepository;
import com.blogapp.blog.repository.PostRepository;
import com.blogapp.blog.repository.UserRepository;

@Service
public class LikeService {

	private final PostLikeRepository postLikeRepository;
	private final PostRepository postRepository;
	private final UserRepository userRepository;

	public LikeService(PostLikeRepository postLikeRepository, PostRepository postRepository,
			UserRepository userRepository) {

		this.postLikeRepository = postLikeRepository;

		this.postRepository = postRepository;

		this.userRepository = userRepository;
	}
	// =====================================================
	// GET AUTHENTICATED USER
	// =====================================================

	private User getAuthenticated() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();

		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Authentication user is Not found!"));
	}

	// =====================================================
	// LIKE POST
	// =====================================================

	public LikeResponse likePost(Long postId) {
		User user = getAuthenticated();

		Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("post not found"));

		// check whether already liked

		boolean alreadyLiked = postLikeRepository.existsByPostIdAndUserId(postId, user.getId());

		if (!alreadyLiked) {

			PostLike postLike = new PostLike();

			postLike.setPost(post);
			postLike.setUser(user);

			postLikeRepository.save(postLike);
		}
		return getLikeResponse(postId, user);

	}

	// =====================================================
	// UNLIKE POST
	// =====================================================

	public LikeResponse unlikePost(Long postId) {
		User user = getAuthenticated();

		PostLike postLike = postLikeRepository.findByPostIdAndUserId(postId, user.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Like Not Found!"));

		postLikeRepository.delete(postLike);
		return getLikeResponse(postId, user);
	}
	// =====================================================
	// GET LIKE INFORMATION
	// =====================================================

	public LikeResponse getLikeInfo(Long postId) {

		User user = getAuthenticated();

		if (!postRepository.existsById(postId)) {

			throw new ResourceNotFoundException("Post not found");
		}

		return getLikeResponse(postId, user);
	}

	// =====================================================
	// CREATE RESPONSE
	// =====================================================

	private LikeResponse getLikeResponse(Long postId, User user) {

		long count = postLikeRepository.countByPostId(postId);

		boolean liked = postLikeRepository.existsByPostIdAndUserId(postId, user.getId());

		return new LikeResponse(postId, count, liked);

	}
}
