package com.blogapp.blog.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blogapp.blog.Enum.ReactionType;
import com.blogapp.blog.dto.ReactionResponse;
import com.blogapp.blog.entity.Post;
import com.blogapp.blog.entity.PostReaction;
import com.blogapp.blog.entity.User;
import com.blogapp.blog.exception.ResourceNotFoundException;
import com.blogapp.blog.repository.PostReactionRepository;
import com.blogapp.blog.repository.PostRepository;
import com.blogapp.blog.repository.UserRepository;

@Service
public class PostReactionService {

	private final PostReactionRepository postReactionRepository;
	private final PostRepository postRepository;
	private final UserRepository userRepository;

	public PostReactionService(PostReactionRepository postLikeRepository, PostRepository postRepository,
			UserRepository userRepository) {

		this.postReactionRepository = postLikeRepository;

		this.postRepository = postRepository;

		this.userRepository = userRepository;
	}
	
	// =====================================================
	// GET AUTHENTICATED USER
	// =====================================================

	private User getAuthenticatedUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();

		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Authentication user is Not found!"));
	}

	// =====================================================
	// LIKE POST
	// =====================================================

	public ReactionResponse likePost(Long postId) {
		User user = getAuthenticatedUser();

		Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found!"));
//
//		// check whether already liked
//
//		boolean alreadyLiked = postLikeRepository.existsByPostIdAndUserId(postId, user.getId());
//
//		if (!alreadyLiked) {
//
//			PostReaction postLike = new PostReaction();
//
//			postLike.setPost(post);
//			postLike.setUser(user);
//
//			postLikeRepository.save(postLike);
//		}
//		return getLikeResponse(postId, user);

		Optional<PostReaction> existingReaction = postReactionRepository.findByPostIdAndUserId(postId, user.getId());

		if (existingReaction.isPresent()) {

			PostReaction reaction = existingReaction.get();

			// If already liked → remove like
			if (reaction.getType() == ReactionType.LIKE) {

				postReactionRepository.delete(reaction);

			}
			// If disliked → change to like
			else {

				reaction.setType(ReactionType.LIKE);

				postReactionRepository.save(reaction);
			}

		} else {

			PostReaction reaction = new PostReaction();

			reaction.setPost(post);
			reaction.setUser(user);
			reaction.setType(ReactionType.LIKE);

			postReactionRepository.save(reaction);
		}

		return getReactionInfo(postId);

	}

	// =====================================================
	// DISLIKE
	// =====================================================

	public ReactionResponse dislikePost(Long postId) {

		User user = getAuthenticatedUser();

		Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post Not found!"));

		Optional<PostReaction> existingReaction = postReactionRepository.findByPostIdAndUserId(postId, user.getId());

		if (existingReaction.isPresent()) {
			PostReaction reaction = existingReaction.get();

			// If already disliked -> remove dislike

			if (reaction.getType() == ReactionType.DISLIKE) {
				postReactionRepository.delete(reaction);
			}

			// If liked → change to dislike
			else {
				reaction.setType(ReactionType.DISLIKE);

				postReactionRepository.save(reaction);
			}
		} else {
			PostReaction reaction = new PostReaction();

			reaction.setPost(post);
			reaction.setUser(user);
			reaction.setType(ReactionType.DISLIKE);
			postReactionRepository.save(reaction);
		}
		return getReactionInfo(postId);
	}

	// =====================================================
	// REMOVE REACTION
	// =====================================================
	public ReactionResponse removeReaction(Long postId) {

		User user = getAuthenticatedUser();

		PostReaction reaction = postReactionRepository.findByPostIdAndUserId(postId, user.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Reaction not found"));

		postReactionRepository.delete(reaction);

		return getReactionInfo(postId);
	}

	// =====================================================
	// GET REACTION INFORMATION
	// =====================================================

	public ReactionResponse getReactionInfo(Long postId) {

		User user = getAuthenticatedUser();

		long likeCount = postReactionRepository.countByPostIdAndType(postId, ReactionType.LIKE);

		long dislikeCount = postReactionRepository.countByPostIdAndType(postId, ReactionType.DISLIKE);

		Optional<PostReaction> reaction = postReactionRepository.findByPostIdAndUserId(postId, user.getId());

		String currentReaction = reaction.map(r -> r.getType().name()).orElse(null);

		return new ReactionResponse(postId, likeCount, dislikeCount, currentReaction);
	}

}
