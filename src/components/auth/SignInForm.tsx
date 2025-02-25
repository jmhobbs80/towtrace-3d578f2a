
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidEmail } from "./utils/validation";
import { FormHeader } from "./components/FormHeader";
import { SignInFields } from "./components/SignInFields";
import { AuthLinks } from "./components/AuthLinks";

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
      console.error("Reset password error:", error);
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
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .single();

      if (roleError) throw new Error("Could not fetch user role");

      const roleRedirects: Record<string, string> = {
        admin: "/admin",
        overwatch_admin: "/admin",
        dispatcher: "/dispatch",
        fleet_manager: "/fleet",
      };

      navigate(roleRedirects[roleData.role] || "/");

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
    } catch (error) {
      console.error("Authentication error:", error);
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
      {/* ✅ Fix: Ensure TowTrace Logo is at the top */}
      <FormHeader />

      {/* ✅ Fix: Ensure correct login fields are used */}
      <SignInFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        onSubmit={handleSubmit}
      />

      {/* ✅ Fix: Remove extra "Forgot Password" links */}
      <AuthLinks
        isDialogOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        resetEmail={resetEmail}
        onResetEmailChange={setResetEmail}
        resetStep={resetStep}
        isResetting={isResetting}
        onResetSubmit={handleResetSubmit}
      />
    </div>
  );
}
