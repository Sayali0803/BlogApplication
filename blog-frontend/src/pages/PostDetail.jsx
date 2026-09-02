import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import api from "../services/api";
import {
    likePost,
    dislikePost,
    getReactionInfo
} from "../services/reactionService";
import {
    FiArrowLeft, FiEdit2, FiTrash2,
    FiUser, FiCalendar, FiTag, FiBookOpen,
    FiMessageCircle, FiSend, FiThumbsUp, FiThumbsDown
} from "react-icons/fi";

function PostDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Comments state
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState("");

    // Reaction state: { [postId]: { likeCount, dislikeCount, currentReaction } }
    const [reactionData, setReactionData] = useState({});

    // Get logged-in user
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    // =========================================================
    // FETCH POST
    // =========================================================

    useEffect(() => {

        const fetchPost = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(`/posts/${id}`);
                setPost(response.data);

            } catch (error) {

                console.error("Fetch post error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load post"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchPost();

    }, [id]);

    // =========================================================
    // FETCH REACTION INFO
    // =========================================================

    useEffect(() => {

        const fetchReaction = async () => {

            try {

                const data = await getReactionInfo(id);
                setReactionData((prev) => ({
                    ...prev,
                    [id]: data
                }));

            } catch (error) {

                console.error("Fetch reaction error:", error);
            }
        };

        if (id) fetchReaction();

    }, [id]);

    // =========================================================
    // FETCH COMMENTS
    // =========================================================

    useEffect(() => {

        const fetchComments = async () => {

            try {

                const response = await api.get(`/posts/${id}/comments`);
                setComments(response.data);

            } catch (error) {

                console.error("Fetch comments error:", error);
            }
        };

        fetchComments();

    }, [id]);

    // =========================================================
    // DELETE POST
    // =========================================================

    const deletePost = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/posts/${id}`);
            navigate("/");

        } catch (error) {

            console.error("Delete error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete post"
            );
        }
    };

    // =========================================================
    // REACTIONS — LIKE / DISLIKE
    // =========================================================

    const handleLike = async (postId) => {

        try {

            const data = await likePost(postId);

            setReactionData((previous) => ({
                ...previous,
                [postId]: data
            }));

        } catch (error) {

            console.error("Failed to like post", error);
        }
    };

    const handleDislike = async (postId) => {

        try {

            const data = await dislikePost(postId);

            setReactionData((previous) => ({
                ...previous,
                [postId]: data
            }));

        } catch (error) {

            console.error("Failed to dislike post", error);
        }
    };

    // =========================================================
    // SUBMIT COMMENT
    // =========================================================

    const submitComment = async (e) => {

        e.preventDefault();

        if (!commentText.trim()) return;

        setCommentLoading(true);
        setCommentError("");

        try {

            const response = await api.post(
                `/posts/${id}/comments`,
                JSON.stringify(commentText),
                { headers: { "Content-Type": "application/json" } }
            );

            // Prepend new comment to the top
            setComments((prev) => [response.data, ...prev]);
            setCommentText("");

        } catch (error) {

            console.error("Comment submit error:", error);

            setCommentError(
                error.response?.data?.message ||
                "Failed to post comment"
            );

        } finally {

            setCommentLoading(false);
        }
    };

    // =========================================================
    // DELETE COMMENT
    // =========================================================

    const deleteComment = async (commentId) => {

        const confirmDelete = window.confirm(
            "Delete this comment?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/posts/comments/${commentId}`);

            setComments((prev) =>
                prev.filter((c) => c.id !== commentId)
            );

        } catch (error) {

            console.error("Delete comment error:", error);

            setCommentError(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        }
    };

    // =========================================================
    // HELPERS
    // =========================================================

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    const isOwner = post?.user?.email === currentUser?.email;

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-custom"></div>
                <p>Loading post...</p>
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error || !post) {
        return (
            <div className="post-detail-page">
                <Container>
                    <div className="post-detail-card mx-auto">
                        <div className="alert-custom-error mb-4" role="alert">
                            {error || "Post not found"}
                        </div>
                        <button
                            className="btn-back"
                            onClick={() => navigate("/")}
                        >
                            <FiArrowLeft size={16} /> Back to Home
                        </button>
                    </div>
                </Container>
            </div>
        );
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="post-detail-page">
            <Container>
                <div className="post-detail-card mx-auto">

                    {/* Back Button */}
                    <button
                        className="btn-back"
                        onClick={() => navigate("/")}
                    >
                        <FiArrowLeft size={16} /> Back to Home
                    </button>

                    {/* Category Badge */}
                    {post.category?.name && (
                        <div className="detail-category-badge">
                            <FiTag size={12} />
                            {post.category.name}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="post-detail-title">
                        {post.title}
                    </h1>

                    {/* Meta Row */}
                    <div className="post-detail-meta">
                        <span className="author-badge">
                            <FiUser size={12} />
                            {post.user?.name || "Unknown"}
                        </span>
                        <span className="post-meta-item">
                            <FiCalendar size={13} />
                            {formatDate(post.createdAt)}
                        </span>
                        {isOwner && (
                            <span className="owner-badge">
                                Your Post
                            </span>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="detail-divider" />

                    {/* Full Content */}
                    <div className="post-detail-body">
                        <FiBookOpen
                            size={18}
                            style={{
                                color: "var(--primary-light)",
                                marginBottom: 16,
                                display: "block"
                            }}
                        />
                        {post.content}
                    </div>

                    {/* Reactions — Like / Dislike */}
                    <div className="post-like-row">

                        <div className="reaction-section">

                            <button
                                className={`btn-reaction btn-reaction-like${
                                    reactionData[post.id]?.currentReaction === "LIKE"
                                        ? " active-reaction"
                                        : ""
                                }`}
                                onClick={() => handleLike(post.id)}
                                title="Like this post"
                            >
                                <FiThumbsUp size={14} />
                                <span>
                                    {reactionData[post.id]?.likeCount ?? 0}
                                    {" "}Like{reactionData[post.id]?.likeCount !== 1 ? "s" : ""}
                                </span>
                            </button>

                            <button
                                className={`btn-reaction btn-reaction-dislike${
                                    reactionData[post.id]?.currentReaction === "DISLIKE"
                                        ? " active-reaction"
                                        : ""
                                }`}
                                onClick={() => handleDislike(post.id)}
                                title="Dislike this post"
                            >
                                <FiThumbsDown size={14} />
                                <span>
                                    {reactionData[post.id]?.dislikeCount ?? 0}
                                    {" "}Dislike{reactionData[post.id]?.dislikeCount !== 1 ? "s" : ""}
                                </span>
                            </button>

                        </div>

                    </div>

                    {/* Owner Actions */}
                    {isOwner && (
                        <div className="detail-actions">
                            <Link
                                to={`/edit-post/${post.id}`}
                                className="btn-edit"
                            >
                                <FiEdit2 size={14} /> Edit Post
                            </Link>

                            <button
                                className="btn btn-delete"
                                onClick={deletePost}
                            >
                                <FiTrash2 size={14} /> Delete Post
                            </button>
                        </div>
                    )}

                </div>

                {/* ================================================= */}
                {/* COMMENTS SECTION                                    */}
                {/* ================================================= */}

                <div className="comments-section mx-auto">

                    {/* Header */}
                    <div className="comments-header">
                        <FiMessageCircle size={20} />
                        <h2>Comments</h2>
                        {comments.length > 0 && (
                            <span className="comments-count">
                                {comments.length}
                            </span>
                        )}
                    </div>

                    {/* Comment Error */}
                    {commentError && (
                        <div className="alert-custom-error mb-3" role="alert">
                            ⚠️ {commentError}
                        </div>
                    )}

                    {/* Comment Form */}
                    <form
                        className="comment-form"
                        onSubmit={submitComment}
                    >
                        <div className="comment-form-avatar">
                            {getInitials(currentUser?.name)}
                        </div>

                        <div className="comment-form-body">
                            <textarea
                                className="comment-textarea"
                                value={commentText}
                                onChange={(e) =>
                                    setCommentText(e.target.value)
                                }
                                placeholder="Share your thoughts..."
                                rows={3}
                                required
                            />
                            <button
                                type="submit"
                                className="btn-comment-submit"
                                disabled={commentLoading || !commentText.trim()}
                            >
                                {commentLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <FiSend size={14} />
                                        Post Comment
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    {comments.length === 0 ? (

                        <div className="no-comments">
                            <FiMessageCircle size={32} />
                            <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>

                    ) : (

                        <div className="comments-list">
                            {comments.map((comment) => {

                                // Show trash icon only to the comment's author
                                const isCommentOwner =
                                    currentUser != null && (
                                        comment.userEmail === currentUser.email ||
                                        comment.userName  === currentUser.name  ||
                                        String(comment.userId) === String(currentUser.id)
                                    );

                                return (
                                    <div
                                        key={comment.id}
                                        className="comment-item"
                                    >
                                        {/* Avatar */}
                                        <div className="comment-avatar">
                                            {getInitials(comment.userName)}
                                        </div>

                                        {/* Body */}
                                        <div className="comment-body">
                                            <div className="comment-meta">
                                                <span className="comment-author">
                                                    {comment.userName || "Unknown"}
                                                </span>
                                                <span className="comment-date">
                                                    <FiCalendar size={11} />
                                                    {formatDate(comment.createdAt)}
                                                </span>

                                                {/* Delete (owner only) */}
                                                {isCommentOwner && (
                                                    <button
                                                        className="comment-delete-btn"
                                                        onClick={() =>
                                                            deleteComment(comment.id)
                                                        }
                                                        title="Delete comment"
                                                    >
                                                        <FiTrash2 size={13} />
                                                    </button>
                                                )}
                                            </div>

                                            <p className="comment-text">
                                                {comment.content}
                                            </p>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

            </Container>
        </div>
    );
}

export default PostDetail;
