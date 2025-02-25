
import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export function SidebarLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
