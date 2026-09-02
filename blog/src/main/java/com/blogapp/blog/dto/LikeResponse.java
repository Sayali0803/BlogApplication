package com.blogapp.blog.dto;

public class LikeResponse {

    private Long postId;
    private long likeCount;
    private boolean likedByCurrentUser;

    public LikeResponse(
            Long postId,
            long likeCount,
            boolean likedByCurrentUser) {

        this.postId = postId;
        this.likeCount = likeCount;
        this.likedByCurrentUser =
                likedByCurrentUser;
    }

    public Long getPostId() {
        return postId;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public boolean isLikedByCurrentUser() {
        return likedByCurrentUser;
    }
}