
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PasswordResetDialog } from "./PasswordResetDialog";
import { EmailInput } from "./components/EmailInput";
import { PasswordInput } from "./components/PasswordInput";
import { SubmitButton } from "./components/SubmitButton";
import { isValidEmail } from "./utils/validation";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(resetEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsResetting(true);
    setResetStep(2);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) throw error;

      setResetStep(3);
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link",
      });
      
      setTimeout(() => {
        setIsDialogOpen(false);
        setResetStep(1);
        setResetEmail("");
      }, 3000);

    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: "Failed to send reset link. Please try again.",
      });
      setResetStep(1);
    } finally {
      setIsResetting(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("No session returned from authentication");
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id)
        .single();

      if (roleError) {
        throw new Error("Could not fetch user role");
      }

      switch (roleData.role) {
        case 'admin':
        case 'overwatch_admin':
          navigate('/admin');
          break;
        case 'dispatcher':
          navigate('/dispatch');
          break;
        case 'fleet_manager':
          navigate('/fleet');
          break;
        default:
          navigate('/');
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
    } catch (error) {
      console.error('Authentication error:', error);
      let errorMessage = "Failed to sign in";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address";
        }
      }
      
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-secondary">
          Sign in to your account
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-secondary">
            Email
          </Label>
          <EmailInput value={email} onChange={setEmail} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-secondary">
            Password
          </Label>
          <PasswordInput value={password} onChange={setPassword} />
        </div>

        <SubmitButton loading={loading} />
      </form>

      <div className="text-center space-y-4">
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
        >
          Forgot password?
        </button>
        <div className="text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <a href="/auth/signup" className="text-primary hover:text-primary/80 transition-colors duration-200">
            Sign up
          </a>
        </div>
        <PasswordResetDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          resetEmail={resetEmail}
          onResetEmailChange={setResetEmail}
          resetStep={resetStep}
          isResetting={isResetting}
          onSubmit={handleResetSubmit}
        />
      </div>
    </div>
  );
}
