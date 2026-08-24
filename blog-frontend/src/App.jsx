import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";

import ProtectedRoute from "./components/ProtectedRoute";
import AppNavbar from "./components/Navbar";

import EditPost from "./pages/EditPost";

function App() {

    return (
        <BrowserRouter>

            <AppNavbar />

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-post"
                    element={
                        <ProtectedRoute>
                            <CreatePost />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-post/:id"
                    element={
                        <ProtectedRoute>
                            <EditPost />
                        </ProtectedRoute>
                    }
                />

            </Routes>

            {/* Global Footer */}
            <footer className="page-footer">
                Made with ♥ by <span>Blogify</span> — share your story with the world.
            </footer>

        </BrowserRouter>
    );
}

export default App;