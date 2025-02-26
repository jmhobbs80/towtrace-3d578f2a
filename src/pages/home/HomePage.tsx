
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/branding/Logo";
import { Car, Map, Truck, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, orgName });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="container h-full flex items-center justify-between">
          <Logo size="md" className="text-primary" />
          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              Login
            </Link>
            <Button
              asChild
              variant="default"
              className="bg-primary hover:bg-primary/90"
            >
              <Link to="/auth?signup=true">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 min-h-[600px]">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900 font-display leading-tight">
                Streamline Your{" "}
                <span className="text-primary">Towing Operations</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                A comprehensive SaaS platform designed for towing companies, dealers,
                and drivers. Manage your fleet, optimize dispatching, and grow your
                business.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg blur"></div>
              <img
                src="/placeholder.svg"
                alt="TowTrace Dashboard"
                className="relative w-full max-w-[500px] rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Towing Business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for towing and transport companies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-300 border-0 shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Smart Dispatch System
              </h3>
              <p className="text-gray-600">
                AI-powered dispatch with real-time tracking, automated job assignment,
                and route optimization.
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-300 border-0 shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Fleet Management
              </h3>
              <p className="text-gray-600">
                Complete fleet oversight with maintenance tracking, driver management,
                and performance analytics.
              </p>
            </Card>
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-300 border-0 shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Customer Portal
              </h3>
              <p className="text-gray-600">
                Give your customers real-time updates, online payments, and
                self-service options.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Sign-Up Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-md mx-auto">
          <Card className="p-8 shadow-xl border-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Start Your Free Trial
            </h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
              <Input
                type="text"
                placeholder="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full"
                required
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Create Account
              </Button>
            </form>
            <p className="mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/auth" className="text-primary hover:text-primary/90 font-medium">
                Login
              </Link>
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size="md" className="text-white" />
              <span className="text-sm">© 2024 TowTrace</span>
            </div>
            <div className="flex items-center gap-8 mt-4 sm:mt-0 text-sm">
              <Link
                to="/legal/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/legal/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <a
                href="mailto:support@towtrace.com"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
