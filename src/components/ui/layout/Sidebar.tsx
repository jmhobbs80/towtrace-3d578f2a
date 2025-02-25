
import { useState } from "react";
import { Menu, X, Home, Truck, Users, FileText, Settings, LogOut, Building, Wrench, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { OrganizationSwitcher } from "@/components/organization/OrganizationSwitcher";
import type { Database } from "@/integrations/supabase/types";

type OrganizationType = Database['public']['Enums']['organization_type'];

interface NavigationItem {
  name: string;
  icon: typeof Home;
  href: string;
  orgTypes?: OrganizationType[];
}

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { signOut, organization } = useAuth();

  const navigationItems: NavigationItem[] = [
    { name: "Dashboard", icon: Home, href: "/" },
    { 
      name: "Fleet Management", 
      icon: Truck, 
      href: "/fleet",
      orgTypes: ['transporter']
    },
    { 
      name: "Drivers", 
      icon: Users, 
      href: "/drivers",
      orgTypes: ['transporter'] 
    },
    { 
      name: "Inventory", 
      icon: CarFront, 
      href: "/inventory",
      orgTypes: ['dealer', 'wholesaler']
    },
    { 
      name: "Repairs", 
      icon: Wrench, 
      href: "/repairs",
      orgTypes: ['dealer', 'wholesaler']
    },
    { 
      name: "Transport Jobs", 
      icon: Truck, 
      href: "/transport",
      orgTypes: ['dealer', 'wholesaler', 'transporter']
    },
    { 
      name: "Organizations", 
      icon: Building, 
      href: "/organizations",
      orgTypes: ['dealer', 'wholesaler', 'transporter']
    },
    { name: "Reports", icon: FileText, href: "/reports" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const filteredNavItems = organization
    ? navigationItems.filter(item => 
        !item.orgTypes || item.orgTypes.includes(organization.type)
      )
    : navigationItems;

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
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className="text-xl font-bold text-primary">TowTrace</h1>
        </div>

        <div className="p-4">
          <OrganizationSwitcher />
        </div>

        <nav className="mt-4">
          <ul className="space-y-2 px-4">
            {filteredNavItems.map((item) => (
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
