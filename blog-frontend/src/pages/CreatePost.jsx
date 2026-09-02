import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import api from "../services/api";
import { FiType, FiAlignLeft, FiSend, FiTag } from "react-icons/fi";
import { MdOutlineCreate } from "react-icons/md";

function CreatePost() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchCategories = async () => {

            try {

                const response = await api.get("/categories");

                setCategories(response.data);

            } catch (error) {

                console.error(error);
            }
        };

        fetchCategories();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/posts/create-post",
                {
                    title,
                    content,
                    categoryId: Number(categoryId)
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
        <div className="post-form-page">
            <Container>
                <div className="post-form-card mx-auto">

                    {/* Header */}
                    <div className="post-form-header">
                        <div className="post-form-header-icon">
                            <MdOutlineCreate color="#fff" size={26} />
                        </div>
                        <div>
                            <h1>Create New Post</h1>
                            <p>Share your thoughts with the world</p>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="alert-custom-error mb-4" role="alert">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Title */}
                        <div className="mb-4">
                            <label className="form-label-custom">
                                Post Title
                            </label>
                            <div className="input-group-custom">
                                <span className="input-icon">
                                    <FiType />
                                </span>
                                <input
                                    type="text"
                                    className="form-control-custom"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="Write a captivating title..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                            <label className="form-label-custom d-flex align-items-center gap-2">
                                <FiAlignLeft size={14} />
                                Content
                            </label>
                            <textarea
                                className="textarea-custom"
                                value={content}
                                onChange={(e) =>
                                    setContent(e.target.value)
                                }
                                placeholder="Write your story here... Let your ideas flow."
                                rows="10"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="mb-4">
                            <label className="form-label-custom d-flex align-items-center gap-2">
                                <FiTag size={14} />
                                Category
                            </label>
                            <div className="input-group-custom">
                                <span className="input-icon">
                                    <FiTag />
                                </span>
                                <select
                                    className="form-control-custom select-custom"
                                    value={categoryId}
                                    onChange={(e) =>
                                        setCategoryId(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map((category) => (

                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>

                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex gap-3 flex-wrap">
                            <button
                                type="submit"
                                className="btn btn-submit-form"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <FiSend size={16} />
                                        Publish Post
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-cancel"
                                onClick={() => navigate("/")}
                            >
                                Cancel
                            </button>
                        </div>

                    </form>

                </div>
            </Container>
        </div>
    );
}

export default CreatePost;