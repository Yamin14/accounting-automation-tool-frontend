import { Navigate } from "react-router";
import useAuthStore from "../../store/authStore";
import React from "react";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {

    const { user } = useAuthStore();
    
    // not signed in
    if (!user) {
        return <Navigate to="/auth/login" replace />
    }

    // signed in but not approved
    if (user && !user.isApproved) {
        return <Navigate to="/auth/profile" replace />
    }

    return (
        <>{children}</>
    )
}

export default ProtectedRoute