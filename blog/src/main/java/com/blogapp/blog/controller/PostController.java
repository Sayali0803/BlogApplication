package com.blogapp.blog.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blogapp.blog.dto.PostResponse;
import com.blogapp.blog.entity.Post;
import com.blogapp.blog.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/create-post")
    public ResponseEntity<PostResponse> createPost(
            @RequestBody Post post) {

        PostResponse response= postService.createPost(post);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {

        return ResponseEntity.ok(
                postService.getAllPosts()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                postService.getPostById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @RequestBody Post post) {

        return ResponseEntity.ok(
                postService.updatePost(id, post)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id) {

        postService.deletePost(id);

        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> searchPosts(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                postService.searchPosts(keyword)
        );
    }
}

