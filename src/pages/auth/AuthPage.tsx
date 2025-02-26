
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/branding/Logo";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<{
    organization_id: string;
    is_valid: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: number;

    const validateInvite = async (token: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('driver-invites', {
          method: 'GET',
          body: { token },
        });

        if (error) throw error;
        if (mounted) {
          setInviteData(data);
          setIsSignUp(true);
        }
      } catch (error) {
        console.error("Error validating invite:", error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Invalid Invite Link",
            description: error.message,
          });
        }
      }
    };

    const checkSession = async () => {
      try {
        if (!mounted) return;
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setLoading(false);
          return;
        }

        if (session) {
          try {
            // If there's a session, immediately navigate to dashboard
            // This prevents hanging on the auth page
            navigate("/dashboard");
          } catch (error) {
            console.error("Navigation error:", error);
            setLoading(false);
          }
        } else {
          // No session, show the auth forms
          setLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Authentication error",
            description: "Failed to check authentication status",
          });
          setLoading(false);
        }
      }
    };

    // Set a timeout to prevent infinite loading
    timeoutId = window.setTimeout(() => {
      if (mounted && loading) {
        console.log("Auth check timed out");
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Authentication timeout",
          description: "Please try refreshing the page",
        });
      }
    }, 5000);

    const inviteToken = searchParams.get("invite");
    if (inviteToken) {
      validateInvite(inviteToken);
    }

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event);
      if (session) {
        navigate("/dashboard");
      } else {
        setLoading(false);
      }
    });

    if (searchParams.get("type") === "recovery") {
      toast({
        title: "Reset Password",
        description: "You can now set your new password by signing in.",
      });
    }

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate, toast, searchParams, loading]);

  useEffect(() => {
    setIsSignUp(searchParams.get("signup") === "true");
  }, [searchParams]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <div className="text-muted-foreground text-sm">
            Checking authentication...
          </div>
        </div>
      );
    }
    
    return (
      <Card className="w-full max-w-md p-6 space-y-6">
        {isSignUp ? (
          <SignUpForm organizationId={inviteData?.organization_id} />
        ) : (
          <SignInForm />
        )}

        {!inviteData && (
          <>
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
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-center">
          <Logo size="lg" className="animate-fade-in" />
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
