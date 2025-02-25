
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSignUpForm } from "@/hooks/use-signup-form";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface SignUpFormProps {
  organizationId?: string;
}

export function SignUpForm({ organizationId }: SignUpFormProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    companyName,
    setCompanyName,
    role,
    setRole,
    promoCode,
    setPromoCode,
    promoCodeValid,
    promoCodeMessage,
    validatePromoCode,
    loading,
    handleSubmit,
    passwordStrength,
  } = useSignUpForm();

  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const handlePromoCodeBlur = async () => {
    if (promoCode) {
      setIsValidatingPromo(true);
      await validatePromoCode();
      setIsValidatingPromo(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        <PersonalInfoSection
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          companyName={companyName}
          setCompanyName={setCompanyName}
        />

        {password && (
          <div className="space-y-2">
            <PasswordStrengthIndicator strength={passwordStrength} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="promoCode" className="font-medium flex items-center justify-between">
            <span>Promo Code</span>
            <span className="text-sm text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative">
            <Input
              id="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onBlur={handlePromoCodeBlur}
              className={cn(
                "h-11 transition-all duration-200",
                promoCodeValid === true && "border-green-500 focus:border-green-500",
                promoCodeValid === false && "border-red-500 focus:border-red-500",
                !promoCode && "border-input hover:border-primary/50 focus:border-primary"
              )}
              placeholder="Enter promo code for 90-day trial"
            />
            {isValidatingPromo && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </div>
          {promoCodeMessage && (
            <p className={cn(
              "text-sm transition-colors duration-200",
              promoCodeValid ? "text-green-500" : "text-red-500"
            )}>
              {promoCodeMessage}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className={cn(
            "w-full h-11 transition-all duration-200",
            loading && "animate-pulse"
          )}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
