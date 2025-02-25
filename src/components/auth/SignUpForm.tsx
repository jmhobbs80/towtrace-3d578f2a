
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUpForm } from "@/hooks/use-signup-form";
import { FormHeader } from "@/components/auth/components/FormHeader";
import { EmailInput } from "@/components/auth/components/EmailInput";
import { PasswordInput } from "@/components/auth/components/PasswordInput";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/types/auth";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SignUpForm() {
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
    handleSubmit
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
      <FormHeader />
      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="font-medium">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={cn(
                "h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary",
                !firstName && "border-input"
              )}
              placeholder="John"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="font-medium">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={cn(
                "h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary",
                !lastName && "border-input"
              )}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-medium">Email</Label>
          <EmailInput
            value={email}
            onChange={setEmail}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-medium">Password</Label>
          <PasswordInput
            value={password}
            onChange={setPassword}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="font-medium">Company Name</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={cn(
              "h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary",
              !companyName && "border-input"
            )}
            placeholder="Your Company"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="font-medium">Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent className="max-h-[280px]">
              <SelectItem value="dealer" className="py-3">
                <div className="space-y-1">
                  <div className="font-medium">Dealer</div>
                  <div className="text-xs text-muted-foreground">For automotive dealerships managing vehicle inventory</div>
                </div>
              </SelectItem>
              <SelectItem value="dispatcher" className="py-3">
                <div className="space-y-1">
                  <div className="font-medium">Dispatcher</div>
                  <div className="text-xs text-muted-foreground">For managing tow truck operations and assignments</div>
                </div>
              </SelectItem>
              <SelectItem value="driver" className="py-3">
                <div className="space-y-1">
                  <div className="font-medium">Driver</div>
                  <div className="text-xs text-muted-foreground">For tow truck operators and field personnel</div>
                </div>
              </SelectItem>
              <SelectItem value="wholesaler" className="py-3">
                <div className="space-y-1">
                  <div className="font-medium">Wholesaler</div>
                  <div className="text-xs text-muted-foreground">For wholesale vehicle buyers and sellers</div>
                </div>
              </SelectItem>
              <SelectItem value="overwatch_admin" className="py-3">
                <div className="space-y-1">
                  <div className="font-medium">Overwatch Admin</div>
                  <div className="text-xs text-muted-foreground">For system administrators and oversight</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

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
