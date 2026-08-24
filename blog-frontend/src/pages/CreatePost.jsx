import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreatePost() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/posts/create-post",
                {
                    title,
                    content
                }
            );

            console.log(
                "Created post:",
                response.data
            );

            // Go back to dashboard
            navigate("/");

        } catch (error) {

            console.error(
                "Create post error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create post"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div>

            <h1>Create Post</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Enter post title"
                        required
                    />
                </div>

                <div>
                    <label>Content</label>

                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        placeholder="Write your post..."
                        rows="10"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Post"}
                </button>

            </form>

        </div>
    );
}

export default CreatePost;