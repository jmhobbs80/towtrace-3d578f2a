
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { PasswordResetDialog } from "./PasswordResetDialog";

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
        <TwoFactorSetup
          qrCodeUrl={qrCodeUrl}
          totpCode={totpCode}
          onTotpCodeChange={(code) => setTotpCode(code)}
          onVerify={verifyTwoFactor}
        />
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
                  className="pl-10 h-11 text-base border-[#E5DEFF] focus:border-[#9b87f5]