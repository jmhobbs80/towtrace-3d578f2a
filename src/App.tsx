
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import Index from './pages/Index';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthProvider';
import { SidebarProvider, Sidebar, SidebarInset } from './components/ui/sidebar';
import BillingDashboard from './pages/billing/BillingDashboard';

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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
