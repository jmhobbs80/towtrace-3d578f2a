
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { PasswordResetDialog } from "./PasswordResetDialog";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

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
      
      // Close dialog after successful reset
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

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.session) {
        throw new Error("No session returned from authentication");
      }

      // Get user role for redirection
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id)
        .single();

      if (roleError) {
        console.error('Role fetch error:', roleError);
        throw new Error("Could not fetch user role");
      }

      // Role-based redirect
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
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-medium text-[#1A1F2C]">Email</Label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-[#7E69AB]" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 text-base border-[#E5DEFF] focus:border-[#9b87f5] hover:border-[#9b87f5] rounded-lg shadow-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-sm font-medium text-[#1A1F2C]">Password</Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-[#7E69AB]" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 text-base border-[#E5DEFF] focus:border-[#9b87f5] hover:border-[#9b87f5] rounded-lg shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-[#7E69AB] hover:text-[#9b87f5] focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="text-sm text-[#7E69AB] hover:text-[#9b87f5]"
        >
          Forgot password?
        </button>
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
