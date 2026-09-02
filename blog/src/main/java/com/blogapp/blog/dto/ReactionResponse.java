package com.blogapp.blog.dto;

public class ReactionResponse {

    private Long postId;

    private long likeCount;

    private long dislikeCount;

    private String currentReaction;


    public ReactionResponse(
            Long postId,
            long likeCount,
            long dislikeCount,
            String currentReaction
    ) {
        this.postId = postId;
        this.likeCount = likeCount;
        this.dislikeCount = dislikeCount;
        this.currentReaction = currentReaction;
    }


    public Long getPostId() {
        return postId;
    }


    public long getLikeCount() {
        return likeCount;
    }


    public long getDislikeCount() {
        return dislikeCount;
    }


    public String getCurrentReaction() {
        return currentReaction;
    }
}