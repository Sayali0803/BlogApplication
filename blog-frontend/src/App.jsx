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
import Navbar from "./components/Navbar";

import EditPost from "./pages/EditPost";

function App() {

    return (
        <BrowserRouter>

            <Navbar />

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

        </BrowserRouter>
    );
}

export default App;