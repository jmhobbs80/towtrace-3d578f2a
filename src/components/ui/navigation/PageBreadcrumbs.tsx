
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

// Map route paths to readable names
const pathNames: Record<string, string> = {
  dashboard: "Dashboard",
  fleet: "Fleet Management",
  inventory: "Inventory",
  analytics: "Analytics",
  billing: "Billing",
  settings: "Settings",
  admin: "Admin",
  customer: "Customer Portal",
  help: "Help Center",
  legal: "Legal",
  "legal/terms": "Terms of Service",
  "legal/privacy": "Privacy Policy",
  "legal/compliance": "Compliance",
  "dealer/inventory": "Inventory Management",
  "dealer/repairs": "Repair Tracking",
  "dealer/repairs/create": "Create Repair Order",
  "dealer/repairs/dashboard": "Repair Dashboard",
  "dealer/repairs/facilities": "Repair Facilities",
  "dealer/transport-requests": "Transport Requests",
  "dealer/vehicles-in-transit": "Vehicles in Transit",
  "dealer/preferred-transporters": "Preferred Transporters",
  "dealer/inventory/inspections": "Inspection History",
  "dealer/inventory/templates": "Inspection Templates",
};

export function PageBreadcrumbs() {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{
    path: string;
    name: string;
    isLast: boolean;
  }>>([]);

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(x => x);
    const crumbs = pathSegments.map((path, index) => {
      const pathTo = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return {
        path: pathTo,
        name: pathNames[pathSegments.slice(0, index + 1).join('/')] || path,
        isLast: index === pathSegments.length - 1
      };
    });

    setBreadcrumbs(crumbs);
  }, [location]);

  // Don't show breadcrumbs on the home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={crumb.path}>
            {crumb.isLast ? (
              <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link to={crumb.path}>{crumb.name}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
