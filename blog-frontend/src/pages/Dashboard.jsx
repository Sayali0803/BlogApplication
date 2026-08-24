import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const [posts, setPosts] = useState([]);
    const [keyword, setKeyword] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            setPosts(response.data);

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
        return <h2>Loading posts...</h2>;
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <div>

            <h1>Blog Dashboard</h1>

            {/* ================= SEARCH ================= */}

            <div>

                <input
                    type="text"
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)
                    }
                    placeholder="Search posts..."
                />

                <button onClick={searchPosts}>
                    Search
                </button>

                <button
                    onClick={() => {
                        setKeyword("");
                        fetchPosts();
                    }}
                >
                    Clear
                </button>

            </div>

            <br />

            {/* ================= ERROR ================= */}

            {error && (
                <p>{error}</p>
            )}

            {/* ================= POSTS ================= */}

            {posts.length === 0 ? (

                <p>No posts found.</p>

            ) : (

                posts.map((post) => {

                    // =================================================
                    // CHECK WHETHER CURRENT USER OWNS THIS POST
                    // =================================================

                    const isOwner =
                        post.user?.email ===
                        currentUser?.email;

                    return (

                        <div key={post.id}>

                            <h2>
                                {post.title}
                            </h2>

                            <p>
                                {post.content}
                            </p>

                            <p>
                                <strong>
                                    Author:
                                </strong>{" "}
                                {post.user?.name}
                            </p>

                            <p>
                                <strong>
                                    Created:
                                </strong>{" "}
                                {post.createdAt
                                    ? new Date(
                                        post.createdAt
                                    ).toLocaleString()
                                    : "N/A"}
                            </p>

                            {/* =================================================
                                ONLY OWNER CAN SEE EDIT / DELETE
                            ================================================= */}

                            {isOwner && (
                                <>

                                    <Link
                                        to={`/edit-post/${post.id}`}
                                    >
                                        <button>
                                            Edit
                                        </button>
                                    </Link>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            deletePost(
                                                post.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </>
                            )}

                            <hr />

                        </div>
                    );
                })
            )}

        </div>
    );
}

export default Dashboard;