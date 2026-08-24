import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav>

            <div>
                <Link to="/">
                    <strong>My Blog</strong>
                </Link>
            </div>

            {token && (
                <div>

                    <Link to="/">
                        Home
                    </Link>

                    {" | "}

                    <Link to="/create-post">
                        Create Post
                    </Link>

                    {" | "}

                    <span>
                        Welcome, {user?.name}
                    </span>

                    {" | "}

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                </div>
            )}

        </nav>
    );
}

export default Navbar;