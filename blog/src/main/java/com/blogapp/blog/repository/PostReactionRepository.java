package com.blogapp.blog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blogapp.blog.Enum.ReactionType;
import com.blogapp.blog.entity.PostReaction;

public interface PostReactionRepository
        extends JpaRepository<PostReaction, Long> {

    Optional<PostReaction> findByPostIdAndUserId(
            Long postId,
            Long userId
    );

//    long countByPostId(Long postId);
    long countByPostIdAndType(
            Long postId,
            ReactionType type
    );

    boolean existsByPostIdAndUserId(
            Long postId,
            Long userId
    );
}