package com.blogapp.blog.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.blogapp.blog.entity.Post;
import com.blogapp.blog.repository.PostRepository;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // CREATE
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // READ ALL
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // READ ONE
    public Post getPostById(Long id) {

        return postRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Post not found with id: " + id
                        )
                );
    }

    // UPDATE
    public Post updatePost(Long id, Post updatedPost) {

        Post existingPost = postRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Post not found with id: " + id
                        )
                );

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        return postRepository.save(existingPost);
    }

    // DELETE
    public void deletePost(Long id) {

        if (!postRepository.existsById(id)) {
            throw new RuntimeException(
                    "Post not found with id: " + id
            );
        }

        postRepository.deleteById(id);
    }
    
   
    // SEARCH BY TITLE
    public List<Post> searchPosts(String keyword) {
        return postRepository.findByTitleContainingIgnoreCase(keyword);
    }
}