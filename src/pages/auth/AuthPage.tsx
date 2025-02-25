
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Pre-Sign-Up Text */}
      {isSignUp ? (
        <p className="text-muted-foreground text-sm mb-8 text-center">
          Create an account to manage your fleet with TowTrace.
        </p>
      ) : (
        <p className="text-muted-foreground text-sm mb-8 text-center">
          Sign in to continue managing your fleet.
        </p>
      )}

      {loading ? (
        <div className="text-muted-foreground text-sm animate-pulse">
          Checking authentication...
        </div>
      ) : isSignUp ? (
        <SignUpForm />
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
