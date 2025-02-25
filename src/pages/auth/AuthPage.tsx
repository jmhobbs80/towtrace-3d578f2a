import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true); // Prevents premature navigation

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);

        // Fetch the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          // Fetch user role for redirection
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          if (roleError) throw roleError;

          // Role-based redirect logic
          switch (roleData?.role) {
            case "admin":
            case "overwatch_admin":
              navigate("/admin");
              break;
            case "dispatcher":
              navigate("/dispatch");
              break;
            case "fleet_manager":
              navigate("/fleet");
              break;
            default:
              navigate("/");
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Failed to check authentication status",
        });
      } finally {
        setLoading(false); // Ensure loading state is removed
      }
    };

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkSession();
      }
    });

    // Handle password reset confirmation
    if (searchParams.get("type") === "recovery") {
      toast({
        title: "Reset Password",
        description: "You can now set your new password by signing in.",
      });
    } else {
      checkSession();
    }

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate, toast, searchParams]);

  useEffect(() => {
    setIsSignUp(searchParams.get("signup") === "true");
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="text-gray-500 text-sm">Checking authentication...</div>
      ) : isSignUp ? (
        <SignUpForm />
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
