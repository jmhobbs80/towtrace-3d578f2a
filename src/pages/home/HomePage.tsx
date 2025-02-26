
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/branding/Logo";
import { Car, Map, Truck } from "lucide-react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, orgName });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-[#607D8B] z-50">
        <div className="container h-full flex items-center justify-between">
          <Logo size="md" className="text-white" />
          <Link
            to="/auth"
            className="text-[#1E88E5] hover:text-[#1976D2] font-medium transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 min-h-[600px] bg-white">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-[#263238] font-display">
              Streamline Your Towing Operations
            </h1>
            <p className="text-lg text-[#607D8B]">
              A multi-tenant SaaS platform for towing companies, dealers, and drivers
            </p>
            <Button
              size="lg"
              className="bg-[#1E88E5] hover:bg-[#1976D2] text-white"
            >
              Sign Up Now
            </Button>
          </div>
          <div className="flex justify-center">
            <img
              src="/placeholder.svg"
              alt="TowTrace Dashboard"
              className="w-full max-w-[400px] h-[300px] object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-[#1E88E5]/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-[#1E88E5]" />
              </div>
              <h3 className="text-xl font-bold text-[#263238]">
                Public Ride-Hailing App
              </h3>
              <p className="text-[#607D8B]">
                Request towing services with real-time tracking and payments via Stripe,
                Apple Pay, Google Pay.
              </p>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-[#1E88E5]/10 flex items-center justify-center">
                <Map className="h-6 w-6 text-[#1E88E5]" />
              </div>
              <h3 className="text-xl font-bold text-[#263238]">
                AI-Powered Dispatch
              </h3>
              <p className="text-[#607D8B]">
                Optimize job assignments with live updates and multi-stop route
                planning.
              </p>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-[#1E88E5]/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-[#1E88E5]" />
              </div>
              <h3 className="text-xl font-bold text-[#263238]">
                Fleet & Inventory Management
              </h3>
              <p className="text-[#607D8B]">
                Track vehicles, maintenance, and inventory with VIN scanning and
                QuickBooks sync.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Sign-Up Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-md mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#263238] mb-6 text-center">
              Get Started Today
            </h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#1E88E5] hover:bg-[#1976D2]">
                Create Account
              </Button>
            </form>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link to="/auth" className="text-[#1E88E5] hover:text-[#1976D2]">
                Login
              </Link>
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#607D8B] text-white py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between text-sm">
          <p>© 2025 TowTrace</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Link
              to="/legal/terms"
              className="text-[#1E88E5] hover:text-[#FF5722] transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/legal/privacy"
              className="text-[#1E88E5] hover:text-[#FF5722] transition-colors"
            >
              Privacy
            </Link>
            <a
              href="mailto:support@towtrace.com"
              className="text-[#1E88E5] hover:text-[#FF5722] transition-colors"
            >
              support@towtrace.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
