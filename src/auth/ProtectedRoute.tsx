import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) 
{
    const { user, loading } = useAuth();

    if (loading) return <p className="text-center mt-20">Loading...</p>;
    if (!user) return <Navigate to="/" replace />;

    return <>{children}</>;
}
