package com.blogapp.blog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.blogapp.blog.dto.ReactionResponse;
import com.blogapp.blog.service.PostReactionService;

@RestController
@RequestMapping("/api/posts")
public class PostReactionController {

    private final PostReactionService postReactionService;

    public PostReactionController(
            PostReactionService postReactionService) {

        this.postReactionService = postReactionService;
    }

    // =====================================================
    //  Like / remove like / change dislike to like
    // =====================================================

    @PostMapping("/{postId}/like")
    public ResponseEntity<ReactionResponse> likePost(
            @PathVariable Long postId) {

        return ResponseEntity.ok(
        		postReactionService.likePost(postId)
        );
    }

    // =====================================================
    // Dislike / remove dislike / change like to dislike
    // =====================================================

    @PostMapping("/{postId}/dislike")
    public ResponseEntity<ReactionResponse> unlikePost(
            @PathVariable Long postId) {

        return ResponseEntity.ok(
                postReactionService.dislikePost(postId)
        );
    }
    
    // =====================================================
    // Remove current reaction
    // =====================================================
    
    @DeleteMapping("/{postId}/reaction")
    public ResponseEntity<ReactionResponse> removeReaction(@PathVariable Long postId){

		return ResponseEntity.ok(postReactionService.removeReaction(postId));
	}

	// =====================================================
	// Get like/dislike information
	// =====================================================

    @GetMapping("/{postId}/like")
    public ResponseEntity<ReactionResponse> getLikeInfo(
            @PathVariable Long postId) {

        return ResponseEntity.ok(
                postReactionService.getReactionInfo(postId)
        );
    }
}