package com.blogapp.blog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blogapp.blog.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
		List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);
}
