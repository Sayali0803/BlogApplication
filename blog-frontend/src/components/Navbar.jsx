import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FiLogOut, FiPenTool, FiHome, FiUser } from "react-icons/fi";


function AppNavbar() {

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
        <Navbar className="blog-navbar" expand="lg">
            <Container>
                {/* Brand */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <img
                        src="/favicon.svg"
                        alt="Blogify"
                        style={{ width: 32, height: 32, borderRadius: 8 }}
                    />
                    Blogify
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="main-navbar"
                    style={{
                        border: "1px solid rgba(255,255,255,0.2)",
                        filter: "invert(1)"
                    }}
                />

                <Navbar.Collapse id="main-navbar">
                    {token && (
                        <Nav className="ms-auto align-items-center gap-2">
                            <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-1">
                                <FiHome size={14} /> Home
                            </Nav.Link>

                            <Nav.Link as={Link} to="/create-post" className="d-flex align-items-center gap-1">
                                <FiPenTool size={14} /> Write
                            </Nav.Link>

                            <div className="welcome-badge ms-2">
                                <FiUser size={13} />
                                {user?.name}
                            </div>

                            <button
                                className="btn navbar-logout-btn ms-2 d-flex align-items-center gap-2"
                                onClick={handleLogout}
                            >
                                <FiLogOut size={14} />
                                Logout
                            </button>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;