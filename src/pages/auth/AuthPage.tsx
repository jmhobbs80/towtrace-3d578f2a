
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/");
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Failed to check authentication status",
        });
      }
    };

    // Check if we're in a password reset flow
    const isReset = searchParams.get('type') === 'recovery';
    if (isReset) {
      // Handle password reset
      const handlePasswordReset = async () => {
        try {
          // The URL already contains the necessary tokens
          // Just show a message to the user
          toast({
            title: "Reset Password",
            description: "You can now set your new password by signing in.",
          });
        } catch (error) {
          console.error('Password reset error:', error);
          toast({
            variant: "destructive",
            title: "Reset error",
            description: "Failed to process password reset",
          });
        }
      };
      handlePasswordReset();
    } else {
      checkSession();
    }
  }, [navigate, toast, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            {isSignUp ? "Create an account" : "Sign in to your account"}
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignUp ? <SignUpForm /> : <SignInForm />}

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
