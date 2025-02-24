
import { useState } from "react";
import { Menu, X, Home, Truck, Users, FileText, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { signOut } = useAuth();

  const navigationItems = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Jobs", icon: Truck, href: "/jobs" },
    { name: "Drivers", icon: Users, href: "/drivers" },
    { name: "Transport", icon: Truck, href: "/transport" },
    { name: "Reports", icon: FileText, href: "/reports" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-40",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-primary">TowTrace</h1>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={signOut}
                className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
