package com.blogapp.blog.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blogapp.blog.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
	
	// Find all posts
    List<Post> findAll();

    // Find post by id
    Optional<Post> findById(Long id);

    // Check whether post exists
    boolean existsById(Long id);

    // Delete post by id
    void deleteById(Long id);
    
    List<Post> findByTitleContainingIgnoreCase(String title);

//    List<Post> findByUserId(Long userId);

//    List<Post> findByCategoryId(Long categoryId);
}
