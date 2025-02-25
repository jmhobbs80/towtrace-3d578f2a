
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
  const [factorId, setFactorId] = useState<string>("");
  const [challengeId, setChallengeId] = useState<string>("");
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

  const isValidPassword = (pwd: string) => {
    return (
      pwd.length >= PASSWORD_REQUIREMENTS.minLength &&
      PASSWORD_REQUIREMENTS.hasNumber.test(pwd) &&
      PASSWORD_REQUIREMENTS.hasSymbol.test(pwd) &&
      PASSWORD_REQUIREMENTS.hasUppercase.test(pwd) &&
      PASSWORD_REQUIREMENTS.hasLowercase.test(pwd)
    );
  };

  async function setupTwoFactor() {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      
      if (error) throw error;
      
      if (data && data.id && data.totp) {
        setFactorId(data.id);
        setTotpSecret(data.totp.secret);
        setQrCodeUrl(data.totp.qr_code);
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
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      
      if (challenge) {
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.id,
          code: totpCode
        });
        
        if (verifyError) throw verifyError;

        toast({
          title: "2FA Verified",
          description: "Two-factor authentication has been enabled",
        });
        setShowTotpSetup(false);
        navigate("/");
      }
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

    if (!isValidPassword(password)) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "Password must meet all security requirements",
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

  const [sessionWarningShown, setSessionWarningShown] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const SESSION_TIMEOUT = 14 * 60 * 1000; // 14 minutes in milliseconds
  const WARNING_THRESHOLD = 1 * 60 * 1000; // 1 minute before timeout

  const updateActivity = () => {
    setLastActivity(new Date());
    setSessionWarningShown(false);
  };

  useEffect(() => {
    const checkSession = () => {
      const now = new Date();
      const timeSinceLastActivity = now.getTime() - lastActivity.getTime();

      // Show warning when 1 minute remains
      if (timeSinceLastActivity >= SESSION_TIMEOUT - WARNING_THRESHOLD && !sessionWarningShown) {
        setSessionWarningShown(true);
        toast({
          title: "Session Expiring Soon",
          description: "Your session will expire in 1 minute. Please save your work.",
          duration: 10000, // Show for 10 seconds
        });
      }

      // Logout if session has expired
      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        supabase.auth.signOut();
        navigate("/auth");
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
        });
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);

    // Update activity on user interaction
    const events = ['mousedown', 'keydown', 'scroll', 'mousemove'];
    const handleUserActivity = () => updateActivity();
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [lastActivity, sessionWarningShown, navigate]);

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
            <h3 className="text-lg font-semibold text-[#1A1F2C]">Set up Two-Factor Authentication</h3>
            <p className="text-sm text-[#7E69AB] mt-2">
              Scan the QR code with your authenticator app
            </p>
          </div>
          
          <div className="flex justify-center">
            <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 shadow-md rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totpCode" className="text-[#1A1F2C]">Enter verification code</Label>
              <Input
                id="totpCode"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center tracking-widest text-lg border-[#E5DEFF] focus:border-[#9b87f5] hover:border-[#9b87f5]"
              />
            </div>
            <Button
              onClick={verifyTwoFactor}
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors"
            >
              Verify and Enable 2FA
            </Button>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-6" onClick={updateActivity}>
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordStrength(calculatePasswordStrength(e.target.value));
                  }}
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
              {password && (
                <div className="space-y-2">
                  <Progress 
                    value={passwordStrength} 
                    className="h-1.5 bg-[#E5DEFF]"
                    style={{
                      '--progress-background': passwordStrength < 40 ? '#ff453a' :
                                             passwordStrength < 80 ? '#ff9f0a' : '#30D158'
                    } as React.CSSProperties}
                  />
                  <p className="text-xs text-[#7E69AB]">
                    Password must be at least 8 characters long and contain numbers, symbols, and both upper and lowercase letters
                  </p>
                </div>
              )}
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
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="link"
                  className="text-sm text-[#7E69AB] hover:text-[#9b87f5] underline-offset-4"
                >
                  Forgot password?
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md w-[95vw] mx-auto rounded-xl border-[#E5DEFF] p-6 bg-white shadow-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#1A1F2C] text-xl">Reset Password</AlertDialogTitle>
                  <AlertDialogDescription className="text-[#7E69AB]">
                    {resetStep === 1 && "Enter your email address to receive a password reset link."}
                    {resetStep === 2 && "Sending reset instructions..."}
                    {resetStep === 3 && "Reset link has been sent!"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mb-4">
                  <Progress 
                    value={resetStep * 33.33} 
                    className="h-1.5 bg-[#E5DEFF]"
                    style={{
                      '--progress-background': '#9b87f5'
                    } as React.CSSProperties}
                  />
                  <p className="text-xs text-[#7E69AB] mt-2 text-center">
                    Step {resetStep} of 3
                  </p>
                </div>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  {resetStep === 1 && (
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail" className="text-[#1A1F2C]">Email</Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="h-11 border-[#E5DEFF] focus:border-[#9b87f5] hover:border-[#9b87f5] rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                  <AlertDialogFooter className="sm:flex-row flex-col gap-2">
                    <AlertDialogCancel 
                      type="button" 
                      className="sm:mt-0 mt-2 border-[#E5DEFF] text-[#7E69AB] hover:bg-[#E5DEFF]/10"
                    >
                      Cancel
                    </AlertDialogCancel>
                    {resetStep === 1 && (
                      <Button 
                        type="submit" 
                        disabled={isResetting} 
                        className="sm:ml-2 w-full sm:w-auto bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors"
                      >
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
