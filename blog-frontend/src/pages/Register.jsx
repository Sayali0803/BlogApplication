import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await api.post("/auth/register", {
                name,
                email,
                password
            });

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error("Registration error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed"
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
                        <HiSparkles color="#fff" />
                    </div>
                    <h1>Join Blogify</h1>
                    <p>Create your account and start writing today</p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="alert-custom-error mb-3" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div className="alert-custom-success mb-3" role="alert">
                        ✅ {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="mb-3">
                        <label className="form-label-custom">
                            Full Name
                        </label>
                        <div className="input-group-custom">
                            <span className="input-icon">
                                <FiUser />
                            </span>
                            <input
                                type="text"
                                className="form-control-custom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="Create a password"
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
                                Creating account...
                            </>
                        ) : (
                            <>
                                <FiUserPlus size={16} className="me-2" />
                                Create Account
                            </>
                        )}
                    </button>

                </form>

                {/* Footer */}
                <p className="auth-footer-text">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;