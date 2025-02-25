
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import Index from './pages/Index';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthProvider';
import { SidebarProvider, Sidebar, SidebarInset } from './components/ui/sidebar';
import BillingDashboard from './pages/billing/BillingDashboard';
import DispatchDashboard from './pages/dispatch/DispatchDashboard';
import VehicleSearch from './pages/inventory/VehicleSearch';
import InspectionTemplates from './pages/inventory/InspectionTemplates';
import InspectionDetails from './pages/inventory/InspectionDetails';
import InspectionHistoryDashboard from './pages/inventory/InspectionHistoryDashboard';
import InventoryManagement from './pages/inventory/InventoryManagement';
import VehicleDetails from './pages/inventory/VehicleDetails';
import VehiclesInTransit from './pages/transport/VehiclesInTransit';
import FleetManagement from './pages/fleet/FleetManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <Index />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <BillingDashboard />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dispatch"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <DispatchDashboard />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <InventoryManagement />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/search"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <VehicleSearch />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/vehicle/:id"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <VehicleDetails />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/inspections"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <InspectionHistoryDashboard />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/inspection/:id"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <InspectionDetails />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/templates"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <InspectionTemplates />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fleet"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <FleetManagement />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Sidebar />
                  <SidebarInset>
                    <VehiclesInTransit />
                  </SidebarInset>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
