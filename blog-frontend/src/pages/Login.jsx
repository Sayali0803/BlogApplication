import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { MdOutlineArticle } from "react-icons/md";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post("/auth/login", {
                email,
                password,
            });

            console.log("Login response:", response.data);

            // Store JWT
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify({
                    name: response.data.name,
                    email: response.data.email,
                })
            );

            // Go to dashboard
            navigate("/");

        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Header */}
                <div className="auth-card-header">
                    <div className="auth-icon-wrap">
                        <MdOutlineArticle color="#fff" />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your Blogify account</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="alert-custom-error mb-3" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label-custom">
                            Email Address
                        </label>
                        <div className="input-group-custom">
                            <span className="input-icon">
                                <FiMail />
                            </span>
                            <input
                                type="email"
                                className="form-control-custom"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="form-label-custom">
                            Password
                        </label>
                        <div className="input-group-custom">
                            <span className="input-icon">
                                <FiLock />
                            </span>
                            <input
                                type="password"
                                className="form-control-custom"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-gradient-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <FiLogIn size={16} className="me-2" />
                                Sign In
                            </>
                        )}
                    </button>

                </form>

                {/* Footer */}
                <p className="auth-footer-text">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">Create one now</Link>
                </p>

            </div>
        </div>
    );
}

export default Login;