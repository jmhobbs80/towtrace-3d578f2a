import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import TowTraceLogo from "@/assets/towtrace-logo.png"; // Ensure correct logo import

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          if (roleError) throw roleError;

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
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) checkSession();
    });

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* ✅ Fix 1: Ensure TowTrace Logo is Visible */}
      <img src={TowTraceLogo} alt="TowTrace" className="w-32 mb-4" />

      {/* ✅ Fix 2: Add Pre-Sign-Up Text */}
      {isSignUp ? (
        <p className="text-gray-700 text-sm mb-2">Create an account to manage your fleet with TowTrace.</p>
      ) : (
        <p className="text-gray-700 text-sm mb-2">Sign in to continue managing your fleet.</p>
      )}

      {/* ✅ Fix 3: Remove Extra Forgot Password Links - They Are Handled in SignInForm.tsx */}
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
