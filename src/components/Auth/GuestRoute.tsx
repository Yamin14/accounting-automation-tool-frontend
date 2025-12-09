import { Navigate } from "react-router";
import useAuthStore from "../../store/authStore";
import React from "react";

interface Props {
    children: React.ReactNode;
}

const GuestRoute = ({ children }: Props) => {

    const { user } = useAuthStore();

    if (user) {
        return <Navigate to="/" replace />
    }

    return (
        <>{children}</>
    )
}

export default GuestRoute