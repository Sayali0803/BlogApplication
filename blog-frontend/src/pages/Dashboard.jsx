import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import api from "../services/api";
import {
    likePost,
    dislikePost,
    getReactionInfo
} from "../services/reactionService";
import {
    FiSearch, FiX, FiEdit2, FiTrash2,
    FiUser, FiCalendar, FiPenTool, FiBookOpen, FiEye,
    FiThumbsUp, FiThumbsDown
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

function Dashboard() {

    const [posts, setPosts] = useState([]);
    const [keyword, setKeyword] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Reaction state: { [postId]: { likeCount, dislikeCount, currentReaction } }
    const [reactionData, setReactionData] = useState({});

    // Get logged-in user
    const storedUser = localStorage.getItem("user");

    const currentUser = storedUser
        ? JSON.parse(storedUser)
        : null;

    // =========================================================
    // GET ALL POSTS
    // =========================================================

    useEffect(() => {
        fetchPosts();
    }, []);

    const loadReactions = async (postList) => {

        const reactions = {};

        const results = await Promise.allSettled(
            postList.map((p) => getReactionInfo(p.id))
        );

        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                reactions[postList[index].id] = result.value;
            } else {
                console.error(
                    "Failed to load reaction for post",
                    postList[index].id,
                    result.reason
                );
            }
        });

        setReactionData(reactions);
    };

    const fetchPosts = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/posts");

            const fetchedPosts = response.data;
            setPosts(fetchedPosts);

            await loadReactions(fetchedPosts);

        } catch (error) {

            console.error(
                "Fetch posts error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load posts"
            );

        } finally {

            setLoading(false);
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

            console.error(
                "Failed to like post",
                error
            );
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

            console.error(
                "Failed to dislike post",
                error
            );
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const searchPosts = async () => {

        if (!keyword.trim()) {
            fetchPosts();
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    `/posts/search?keyword=${encodeURIComponent(
                        keyword
                    )}`
                );

            setPosts(response.data);

        } catch (error) {

            console.error(
                "Search error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to search posts"
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const deletePost = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this post?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            setError("");

            await api.delete(
                `/posts/${id}`
            );

            // Remove deleted post from screen
            setPosts((currentPosts) =>
                currentPosts.filter(
                    (post) => post.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete post"
            );
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-custom"></div>
                <p>Loading posts...</p>
            </div>
        );
    }

    // Helper: format date nicely
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Stats
    const myPosts = posts.filter(p => p.user?.email === currentUser?.email);

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="dashboard-page">
            <Container>

                {/* Hero */}
                <div className="dashboard-hero">
                    <h1>
                        <HiSparkles style={{ fontSize: "0.8em", verticalAlign: 2 }} />
                        {" "}Blogify Dashboard
                    </h1>
                    <p>Discover stories, ideas, and perspectives from our community</p>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-number">{posts.length}</div>
                        <div className="stat-label">Total Posts</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{myPosts.length}</div>
                        <div className="stat-label">My Posts</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {new Set(posts.map(p => p.user?.name).filter(Boolean)).size}
                        </div>
                        <div className="stat-label">Authors</div>
                    </div>
                </div>

                {/* Search & Create Bar */}
                <div className="search-bar-wrap">
                    <FiSearch color="#7c3aed" size={18} />
                    <input
                        type="text"
                        className="search-input"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search posts by title or content..."
                        onKeyDown={(e) => e.key === "Enter" && searchPosts()}
                    />
                    <button className="btn btn-search" onClick={searchPosts}>
                        <FiSearch size={15} /> Search
                    </button>
                    <button
                        className="btn btn-clear"
                        onClick={() => {
                            setKeyword("");
                            fetchPosts();
                        }}
                    >
                        <FiX size={15} /> Clear
                    </button>
                    <Link to="/create-post" className="btn btn-create-post ms-auto">
                        <FiPenTool size={15} /> Write Post
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert-custom-error mb-4" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                {/* Posts */}
                {posts.length === 0 ? (

                    <div className="no-posts-card">
                        <div className="icon-big">
                            <FiBookOpen />
                        </div>
                        <h3>No posts found</h3>
                        <p>
                            {keyword
                                ? `No results for "${keyword}". Try a different search term.`
                                : "Be the first to write something amazing!"}
                        </p>
                    </div>

                ) : (

                    posts.map((post) => {

                        // =================================================
                        // CHECK WHETHER CURRENT USER OWNS THIS POST
                        // =================================================

                        const isOwner =
                            post.user?.email ===
                            currentUser?.email;

                        return (

                            <div key={post.id} className="post-card">

                                {/* Title row */}
                                <div className="d-flex align-items-start gap-2 mb-1 flex-wrap">
                                    <h2 className="post-card-title flex-grow-1">
                                        {post.title}
                                    </h2>
                                    {isOwner && (
                                        <span className="owner-badge">
                                            ✏️ Yours
                                        </span>
                                    )}
                                </div>

                                {/* Content preview */}
                                <p className="post-card-content">
                                    {post.content}
                                </p>

                                {/* Meta */}
                                <div className="post-meta">
                                    <span className="author-badge">
                                        <FiUser size={11} />
                                        {post.user?.name || "Unknown"}
                                    </span>
                                    <span className="post-meta-item">
                                        <FiCalendar size={12} />
                                        {formatDate(post.createdAt)}
                                    </span>
                                </div>

                                {/* Card Footer Actions */}
                                <div className="post-actions">

                                    {/* Reaction Buttons */}
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
                                            <FiThumbsUp size={13} />
                                            <span>{reactionData[post.id]?.likeCount ?? 0}</span>
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
                                            <FiThumbsDown size={13} />
                                            <span>{reactionData[post.id]?.dislikeCount ?? 0}</span>
                                        </button>

                                    </div>

                                    <Link
                                        to={`/posts/${post.id}`}
                                        className="btn-view"
                                    >
                                        <FiEye size={13} /> View
                                    </Link>

                                    {isOwner && (
                                        <>
                                            <Link
                                                to={`/edit-post/${post.id}`}
                                                className="btn-edit"
                                            >
                                                <FiEdit2 size={13} /> Edit
                                            </Link>

                                            <button
                                                className="btn btn-delete"
                                                onClick={() =>
                                                    deletePost(post.id)
                                                }
                                            >
                                                <FiTrash2 size={13} /> Delete
                                            </button>
                                        </>
                                    )}
                                </div>

                            </div>
                        );
                    })
                )}

            </Container>
        </div>
    );
}

export default Dashboard;