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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
  const [resetStep, setResetStep] = useState(1);
  const [totpCode, setTotpCode] = useState("");
  const [showTotpSetup, setShowTotpSetup] = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= PASSWORD_REQUIREMENTS.minLength) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasNumber.test(pwd)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasSymbol.test(pwd)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasUppercase.test(pwd)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasLowercase.test(pwd)) strength += 20;
    return strength;
  };

  const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

  const canRequestPasswordReset = () => {
    if (!lastResetAttempt) return true;
    const hoursSinceLastAttempt = (new Date().getTime() - lastResetAttempt.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastAttempt >= 1 && resetAttemptsCount < 3;
  };

  async function setupTwoFactor() {
    try {
      const { data: { secret, qr } } = await supabase.auth.mfa.enroll();
      if (secret && qr) {
        setTotpSecret(secret);
        setQrCodeUrl(qr);
        setShowTotpSetup(true);
      }
    } catch (error) {
      console.error('2FA setup error:', error);
      toast({
        variant: "destructive",
        title: "2FA Setup Error",
        description: "Failed to setup two-factor authentication",
      });
    }
  }

  async function verifyTwoFactor() {
    try {
      const { error } = await supabase.auth.mfa.verify({ code: totpCode });
      if (error) throw error;
      
      toast({
        title: "2FA Verified",
        description: "Two-factor authentication has been enabled",
      });
      setShowTotpSetup(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Invalid verification code",
      });
    }
  }

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
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !user.factors?.length) {
        await setupTwoFactor();
      } else {
        navigate("/");
      }
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
    setResetStep(2);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      setLastResetAttempt(new Date());
      setResetAttemptsCount(prev => prev + 1);
      
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions. The link will expire in 15 minutes.",
      });
      setResetStep(3);
      setTimeout(() => {
        setIsDialogOpen(false);
        setResetStep(1);
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
      setResetStep(1);
    } finally {
      setIsResetting(false);
    }
  }

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
      {showTotpSetup ? (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Set up Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Scan the QR code with your authenticator app
            </p>
          </div>
          
          <div className="flex justify-center">
            <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totpCode">Enter verification code</Label>
              <Input
                id="totpCode"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            <Button
              onClick={verifyTwoFactor}
              className="w-full"
            >
              Verify and Enable 2FA
            </Button>
          </div>
        </div>
      ) : (
        <>
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
                    {resetStep === 1 && "Enter your email address to receive a password reset link."}
                    {resetStep === 2 && "Sending reset instructions..."}
                    {resetStep === 3 && "Reset link has been sent!"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mb-4">
                  <Progress value={resetStep * 33.33} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Step {resetStep} of 3
                  </p>
                </div>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  {resetStep === 1 && (
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
                  )}
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    {resetStep === 1 && (
                      <Button type="submit" disabled={isResetting}>
                        {isResetting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    )}
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  );
}
