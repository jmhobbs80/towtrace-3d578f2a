
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/types/auth";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<UserRole>("dealer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company_name: companyName,
            role: role
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }

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
