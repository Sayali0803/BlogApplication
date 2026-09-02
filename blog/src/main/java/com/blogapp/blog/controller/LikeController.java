package com.blogapp.blog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.blogapp.blog.dto.LikeResponse;
import com.blogapp.blog.service.LikeService;

@RestController
@RequestMapping("/api/posts")
public class LikeController {

    private final LikeService likeService;

    public LikeController(
            LikeService likeService) {

        this.likeService = likeService;
    }

    // =====================================================
    // LIKE
    // =====================================================

    @PostMapping("/{postId}/like")
    public ResponseEntity<LikeResponse> likePost(
            @PathVariable Long postId) {

        return ResponseEntity.ok(
                likeService.likePost(postId)
        );
    }

    // =====================================================
    // UNLIKE
    // =====================================================

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<LikeResponse> unlikePost(
            @PathVariable Long postId) {

        return ResponseEntity.ok(
                likeService.unlikePost(postId)
        );
    }

    // =====================================================
    // GET LIKE INFO
    // =====================================================

    @GetMapping("/{postId}/like")
    public ResponseEntity<LikeResponse> getLikeInfo(
            @PathVariable Long postId) {

        return ResponseEntity.ok(
                likeService.getLikeInfo(postId)
        );
    }
}