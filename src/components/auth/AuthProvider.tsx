
import React, { createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/lib/types/auth";
import { useSessionManager } from "./SessionManager";
import { useOrganizationManager, Organization } from "./OrganizationManager";
import { useUserProfileManager } from "./UserProfileManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  organization: Organization | null;
  userRole: UserRole | null;
  signOut: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  organization: null,
  userRole: null,
  signOut: async () => {},
  switchOrganization: async () => {},
  switchRole: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { 
    user, 
    loading, 
    isReconnecting, 
    reconnectAttempts,
    maxReconnectAttempts,
    signOut: handleSignOut,
  } = useSessionManager();
  
  const { organization, switchOrganization } = useOrganizationManager();
  const { userRole, fetchUserRole, switchRole: handleSwitchRole } = useUserProfileManager();

  // Update user role when user changes
  React.useEffect(() => {
    if (user) {
      fetchUserRole(user.id);
    }
  }, [user, fetchUserRole]);

  // Update organization when user changes
  React.useEffect(() => {
    if (user?.user_metadata?.current_organization_id) {
      switchOrganization(user.user_metadata.current_organization_id);
    }
  }, [user, switchOrganization]);

  const signOut = async () => {
    await handleSignOut();
    navigate("/auth");
  };

  const switchRole = async (role: UserRole) => {
    try {
      await handleSwitchRole(role);
      toast.success(`Switched to ${role} role`);
      navigate("/"); // Redirect to home to refresh the view
    } catch (error) {
      console.error('Error switching role:', error);
      toast.error('Failed to switch role');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      organization, 
      userRole, 
      signOut, 
      switchOrganization,
      switchRole 
    }}>
      {isReconnecting && (
        <div 
          className={`
            fixed top-0 left-0 right-0 
            bg-primary/90 text-white 
            ${isMobile ? 'py-1 text-xs' : 'py-2 text-sm'}
            text-center transition-all duration-300
          `}
        >
          Attempting to restore your session... {reconnectAttempts}/{maxReconnectAttempts}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
