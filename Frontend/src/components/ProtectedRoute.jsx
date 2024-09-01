// components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // Check if a valid token exists
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, render child routes
    return <Outlet />;
};

export default ProtectedRoute;