
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const renderAuthContent = () => {
    if (loading) {
      return (
        <div className="text-muted-foreground text-sm animate-pulse">
          Checking authentication...
        </div>
      );
    }
    
    return (
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSignUp
              ? "Create an account to manage your fleet with TowTrace."
              : "Sign in to continue managing your fleet."}
          </p>
        </div>

        {isSignUp ? <SignUpForm /> : <SignInForm />}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {isSignUp ? "Already have an account?" : "New to TowTrace?"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            if (isSignUp) {
              params.delete("signup");
            } else {
              params.set("signup", "true");
            }
            navigate(`/auth?${params.toString()}`);
          }}
        >
          {isSignUp ? "Sign In" : "Create Account"}
        </Button>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <img 
          src="/logo.png" 
          alt="TowTrace" 
          className="h-12 mx-auto"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>

      {renderAuthContent()}
    </div>
  );
}
