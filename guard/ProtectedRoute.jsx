/*eslint-disable react/prop-types*/
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { authentication, user1 } = useContext(AuthContext)

    if (!authentication) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user1.role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
export default ProtectedRoute;
