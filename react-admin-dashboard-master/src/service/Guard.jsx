import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";

export const ProtectedRoute = ({ element }) => {
    const location = useLocation();
    return ApiService.isAuthenticated() ? (
        element
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
};

export const AdminRoute = ({ element }) => {
    const location = useLocation();
    return ApiService.isAdmin() ? (
        element
    ) : (
        <Navigate to="/adminDashboard" replace state={{ from: location }} />
    );
};

export const ArtistRoute = ({ element }) => {
    const location = useLocation();
    return ApiService.isArtist() ? (
        element
    ) : (
        <Navigate to="/artistDashboard" replace state={{ from: location }} />
    );
};

export const ManagerRoute = ({ element }) => {
    const location = useLocation();
    return ApiService.isManager() ? (
        element
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
};