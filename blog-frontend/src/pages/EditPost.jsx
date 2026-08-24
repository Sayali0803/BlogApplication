import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import { Container } from "react-bootstrap";
import api from "../services/api";
import { FiType, FiAlignLeft, FiSave, FiArrowLeft } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";

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
        return (
            <div className="loading-container">
                <div className="spinner-custom"></div>
                <p>Loading post...</p>
            </div>
        );
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="post-form-page">
            <Container>
                <div className="post-form-card mx-auto">

                    {/* Header */}
                    <div className="post-form-header">
                        <div className="post-form-header-icon edit-icon">
                            <MdOutlineEdit color="#fff" size={26} />
                        </div>
                        <div>
                            <h1>Edit Post</h1>
                            <p>Update your story and republish</p>
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
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Post title..."
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
                                rows="10"
                                value={content}
                                onChange={(e) =>
                                    setContent(
                                        e.target.value
                                    )
                                }
                                placeholder="Update your content..."
                                required
                            />
                        </div>

                        {/* Actions */}
                        <div className="d-flex gap-3 flex-wrap">
                            <button
                                type="submit"
                                className="btn btn-submit-form edit-submit"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FiSave size={16} />
                                        Save Changes
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-cancel"
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                <FiArrowLeft size={15} />
                                Cancel
                            </button>
                        </div>

                    </form>

                </div>
            </Container>
        </div>
    );
}

export default EditPost;