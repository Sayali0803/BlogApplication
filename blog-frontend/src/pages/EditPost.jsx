import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

function EditPost() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // GET POST
    // =========================================================

    useEffect(() => {

        const fetchPost = async () => {

            try {

                const response =
                    await api.get(
                        `/posts/${id}`
                    );

                setTitle(
                    response.data.title
                );

                setContent(
                    response.data.content
                );

            } catch (error) {

                console.error(
                    "Fetch post error:",
                    error
                );

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
    // UPDATE POST
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");

            await api.put(
                `/posts/${id}`,
                {
                    title,
                    content
                }
            );

            navigate("/");

        } catch (error) {

            console.error(
                "Update post error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update post"
            );

        } finally {

            setSaving(false);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return <h2>Loading post...</h2>;
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <div>

            <h1>Edit Post</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Title
                    </label>

                    <br />

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>

                <br />

                <div>

                    <label>
                        Content
                    </label>

                    <br />

                    <textarea
                        rows="10"
                        value={content}
                        onChange={(e) =>
                            setContent(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>

                <br />

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Updating..."
                        : "Update Post"}
                </button>

                {" "}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Cancel
                </button>

            </form>

        </div>
    );
}

export default EditPost;