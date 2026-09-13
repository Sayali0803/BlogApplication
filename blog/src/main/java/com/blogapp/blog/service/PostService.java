package com.blogapp.blog.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blogapp.blog.Enum.ReactionType;
import com.blogapp.blog.dto.PageResponse;
import com.blogapp.blog.dto.PostRequest;
import com.blogapp.blog.dto.PostResponse;
import com.blogapp.blog.dto.UserResponseDto;
import com.blogapp.blog.entity.Category;
import com.blogapp.blog.entity.Post;
import com.blogapp.blog.entity.User;
import com.blogapp.blog.exception.ResourceNotFoundException;
import com.blogapp.blog.exception.UnauthorizedException;
import com.blogapp.blog.repository.CategoryRepository;
import com.blogapp.blog.repository.PostReactionRepository;
import com.blogapp.blog.repository.PostRepository;
import com.blogapp.blog.repository.UserRepository;

@Service
public class PostService {

	private final PostRepository postRepository;

	private final UserRepository userRepository;
	
	private final CategoryRepository categoryRepository;
	
	private final PostReactionRepository postReactionRepository;
	

	public PostService(PostRepository postRepository, UserRepository userRepository,
			CategoryRepository categoryRepository,PostReactionRepository postReactionRepository) {
		super();
		this.postRepository = postRepository;
		this.userRepository = userRepository;
		this.categoryRepository = categoryRepository;
		this.postReactionRepository = postReactionRepository;
	}

	// CREATE
	public PostResponse createPost(PostRequest request) {
//		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//		String email = authentication.getName();
//
//		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not Found!"));

		User authenticatedUser = getAuthenticatedUser();
		 Category category =
		            categoryRepository.findById(
		                    request.getCategoryId()
		            )
		            .orElseThrow(() ->
		                    new ResourceNotFoundException(
		                            "Category not found"
		                    )
		            );
		Post post = new Post();
		
		post.setTitle(request.getTitle());
		post.setContent(request.getContent());
	    post.setUser(authenticatedUser);
	    post.setCategory(category);
	    
		Post savedPost = postRepository.save(post);
		return convertToResponse(savedPost);
	}

	// READ ALL
//	public List<PostResponse> getAllPosts() {
//		return postRepository.findAll().stream().map(this::convertToResponse).toList();
//	}

	// READ ONE
	public PostResponse getPostById(Long id) {

		Post post = postRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

		return convertToResponse(post);
	}

	// UPDATE
	public PostResponse updatePost(Long id, PostRequest request) {

		Post existingPost = postRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

		User authenticatedUser = getAuthenticatedUser();

//		Check ownership
		if (!existingPost.getUser().getId().equals(authenticatedUser.getId())) {

			throw new UnauthorizedException("You are not allowed to update this post");
		}

		Category category = categoryRepository
		        .findById(request.getCategoryId())
		        .orElseThrow(() ->
		                new ResourceNotFoundException(
		                        "Category not found with id: "
		                                
		                )
		        );
		existingPost.setTitle(request.getTitle());
		existingPost.setContent(request.getContent());
		existingPost.setCategory(category);
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

	/*private PostResponse convertToResponse(Post post) {

		UserResponseDto userResponse = new UserResponseDto(post.getUser().getId(), post.getUser().getName(),
				post.getUser().getEmail());
		Long categoryId = null;
	    String categoryName = null;

	    if (post.getCategory() != null) {
	        categoryId = post.getCategory().getId();
	        categoryName = post.getCategory().getName();
	    }
		return new PostResponse(post.getId(), post.getTitle(), post.getContent(), post.getCreatedAt(),
				post.getUpdatedAt(),categoryId,categoryName, userResponse);
	}*/
	
	private PostResponse convertToResponse(Post post) {

	    UserResponseDto userResponse = new UserResponseDto(
	            post.getUser().getId(),
	            post.getUser().getName(),
	            post.getUser().getEmail()
	    );

	    // Category
	    Long categoryId = null;
	    String categoryName = null;

	    if (post.getCategory() != null) {
	        categoryId = post.getCategory().getId();
	        categoryName = post.getCategory().getName();
	    }

	    // Like count
	    long likeCount = postReactionRepository
	            .countByPostIdAndType(post.getId(), ReactionType.LIKE);

	    // Dislike count
	    long dislikeCount = postReactionRepository
	            .countByPostIdAndType(post.getId(), ReactionType.DISLIKE);

	    // Current user's reaction
	    String currentReaction = null;

	    Authentication authentication =
	            SecurityContextHolder.getContext().getAuthentication();

	    if (authentication != null
	            && authentication.isAuthenticated()
	            && !authentication.getName().equals("anonymousUser")) {

	        String email = authentication.getName();

	        User authenticatedUser = userRepository.findByEmail(email)
	                .orElse(null);

	        if (authenticatedUser != null) {

	            currentReaction = postReactionRepository
	                    .findByPostIdAndUserId(
	                            post.getId(),
	                            authenticatedUser.getId()
	                    )
	                    .map(reaction -> reaction.getType().name())
	                    .orElse(null);
	        }
	    }

	    return new PostResponse(
	            post.getId(),
	            post.getTitle(),
	            post.getContent(),
	            post.getCreatedAt(),
	            post.getUpdatedAt(),
	            categoryId,
	            categoryName,
	            likeCount,
	            dislikeCount,
	            currentReaction,
	            userResponse
	    );
	}
	
	// READ ALL with Page
	
	public PageResponse<PostResponse> getAllPosts(Pageable pageable){
		
		Page<Post> postPage = postRepository.findAll(pageable);
		
		List<PostResponse> postResponse = postPage.getContent()
													.stream()
													.map(this::convertToResponse)
													.toList();
		
		return new PageResponse<>(
				postResponse,
				postPage.getNumber(),
				postPage.getSize(),
				postPage.getTotalElements(),
				postPage.getTotalPages(),
				postPage.isFirst(),
				postPage.isLast()
				);
	}
}