
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password strength requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasNumber: /\d/,
  hasSymbol: /[!@#$%^&*(),.?":{}|<>]/,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
};

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [lastResetAttempt, setLastResetAttempt] = useState<Date | null>(null);
  const [resetAttemptsCount, setResetAttemptsCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Calculate password strength
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= PASSWORD_REQUIREMENTS.minLength) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasNumber.test(pwd)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasSymbol.test(pwd)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasUppercase.test(pwd)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasLowercase.test(pwd)) strength += 20;
    return strength;
  };

  // Validate email format
  const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

  // Check rate limiting for password reset
  const canRequestPasswordReset = () => {
    if (!lastResetAttempt) return true;
    const hoursSinceLastAttempt = (new Date().getTime() - lastResetAttempt.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastAttempt >= 1 && resetAttemptsCount < 3;
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isValidEmail(resetEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    if (!canRequestPasswordReset()) {
      toast({
        variant: "destructive",
        title: "Too many attempts",
        description: "Please wait an hour before trying again",
      });
      return;
    }

    setIsResetting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      // Update rate limiting data
      setLastResetAttempt(new Date());
      setResetAttemptsCount(prev => prev + 1);
      
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions. The link will expire in 15 minutes.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsResetting(false);
    }
  }

  // Reset attempts count after an hour
  useEffect(() => {
    if (lastResetAttempt) {
      const hoursSinceLastAttempt = (new Date().getTime() - lastResetAttempt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastAttempt >= 1) {
        setResetAttemptsCount(0);
      }
    }
  }, [lastResetAttempt]);

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }}
              className="pl-10 pr-10 h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {password && (
            <div className="space-y-2">
              <Progress value={passwordStrength} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long and contain numbers, symbols, and both upper and lowercase letters
              </p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium rounded-xl transition-all duration-300 hover:scale-[1.02]"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot password?
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Password</AlertDialogTitle>
              <AlertDialogDescription>
                Enter your email address and we'll send you a link to reset your password.
                The link will expire in 15 minutes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <Button type="submit" disabled={isResetting}>
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
