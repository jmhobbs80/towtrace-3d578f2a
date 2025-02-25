
import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Logo } from "@/components/branding/Logo";
import { PageTransition } from "@/components/ui/page-transition";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export function SidebarLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <div className="h-16 border-b bg-white px-4 flex items-center justify-between lg:hidden">
              <Logo variant="mobile" size="sm" />
            </div>
            <SidebarInset>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
