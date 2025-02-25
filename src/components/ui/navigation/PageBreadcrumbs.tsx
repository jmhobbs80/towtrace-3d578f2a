
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
  admin: "Admin",
  "admin/users": "User Management",
  "admin/system-logs": "System Logs",
  "admin/billing-exemptions": "Billing Exemptions",
  "admin/feature-management": "Feature Management",
  "admin/overwatch": "Overwatch Dashboard",
  fleet: "Fleet Management",
  "fleet/vehicles": "Vehicles",
  "fleet/drivers": "Drivers",
  "fleet/maintenance": "Maintenance",
  analytics: "Analytics",
  "analytics/dashboard": "Analytics Dashboard",
  "analytics/reports": "Reports",
  "analytics/ai": "AI Reports",
  billing: "Billing",
  "billing/invoices": "Invoices",
  "billing/payments": "Payments",
  "billing/payouts": "Payouts",
  dispatch: "Dispatch",
  "dispatch/jobs": "Jobs",
  "dispatch/ai": "AI Dispatch",
  dealer: "Dealer Portal",
  "dealer/inventory": "Inventory",
  "dealer/repairs": "Repairs",
  settings: "Settings",
  profile: "Profile",
  auth: "Authentication",
  customer: "Customer Portal",
  help: "Help Center",
  legal: "Legal",
  "legal/terms": "Terms of Service",
  "legal/privacy": "Privacy Policy",
  "legal/compliance": "Compliance",
  notifications: "Notifications",
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
