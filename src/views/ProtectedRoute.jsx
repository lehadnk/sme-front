import {isAuthenticated} from "../domain/Authentication.jsx";
import {Navigate, useLocation} from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};