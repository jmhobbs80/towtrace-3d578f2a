
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserRole } from "@/lib/types/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If we're not loading and there's no user, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If roles are specified and the user doesn't have the required role
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
