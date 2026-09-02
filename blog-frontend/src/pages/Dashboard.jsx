import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import api from "../services/api";
import {
    FiSearch, FiX, FiEdit2, FiTrash2,
    FiUser, FiCalendar, FiPenTool, FiBookOpen, FiEye, FiHeart
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

function Dashboard() {

    const [posts, setPosts] = useState([]);
    const [keyword, setKeyword] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Likes state: { [postId]: { likeCount, likedByCurrentUser } }
    const [likeData, setLikeData] = useState({});

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

    const fetchPosts = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/posts");

            const fetchedPosts = response.data;
            setPosts(fetchedPosts);

            // Fetch like status for every post in parallel
            const likeResults = await Promise.allSettled(
                fetchedPosts.map((p) =>
                    api.get(`/posts/${p.id}/like`)
                )
            );

            const newLikeData = {};
            likeResults.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    newLikeData[fetchedPosts[index].id] =
                        result.value.data;
                }
            });
            setLikeData(newLikeData);

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
    // LIKE / UNLIKE
    // =========================================================

    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/posts/${postId}/like`);
            setLikeData((prev) => ({
                ...prev,
                [postId]: response.data
            }));
        } catch (error) {
            console.error("Like error:", error);
        }
    };

    const handleUnlike = async (postId) => {
        try {
            const response = await api.delete(`/posts/${postId}/like`);
            setLikeData((prev) => ({
                ...prev,
                [postId]: response.data
            }));
        } catch (error) {
            console.error("Unlike error:", error);
        }
    };

    const toggleLike = (postId) => {
        const current = likeData[postId];
        if (current?.likedByCurrentUser) {
            handleUnlike(postId);
        } else {
            handleLike(postId);
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

                                    {/* Combined Like toggle button */}
                                    {(() => {
                                        const cl = likeData[post.id] || {
                                            likeCount: 0,
                                            likedByCurrentUser: false
                                        };
                                        return (
                                            <button
                                                className={`btn-like-toggle${
                                                    cl.likedByCurrentUser
                                                        ? " liked"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    toggleLike(post.id)
                                                }
                                                title={
                                                    cl.likedByCurrentUser
                                                        ? "Unlike"
                                                        : "Like"
                                                }
                                            >
                                                <FiHeart size={14} />
                                                {cl.likeCount}
                                            </button>
                                        );
                                    })()}

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