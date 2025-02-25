
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUpForm } from "@/hooks/use-signup-form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/types/auth";
import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors"
            required
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="role" className="text-sm font-medium">Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
          <SelectTrigger className="h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dealer">Dealer</SelectItem>
            <SelectItem value="dispatcher">Dispatcher</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="wholesaler">Wholesaler</SelectItem>
            <SelectItem value="overwatch_admin">Overwatch Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="promoCode" className="text-sm font-medium">
          Promo Code <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <div className="relative">
          <Input
            id="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            onBlur={handlePromoCodeBlur}
            className={`h-11 text-base bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors ${
              promoCodeValid === true ? 'border-green-500' : 
              promoCodeValid === false ? 'border-red-500' : ''
            }`}
            placeholder="Enter promo code for 90-day trial"
          />
          {isValidatingPromo && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        {promoCodeMessage && (
          <p className={`text-sm ${
            promoCodeValid ? 'text-green-500' : 'text-red-500'
          }`}>
            {promoCodeMessage}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-medium rounded-xl transition-all duration-300 hover:scale-[1.02]"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
