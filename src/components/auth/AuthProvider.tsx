
import React, { createContext, useContext, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/lib/types/auth";
import { useSessionManager } from "./SessionManager";
import { useOrganizationManager, Organization } from "./OrganizationManager";
import { useUserProfileManager } from "./UserProfileManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const INACTIVITY_WARNING = 25 * 60 * 1000; // 25 minutes

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

  // Monitor session activity and enforce timeouts
  useEffect(() => {
    if (!user) return;

    let warningTimeout: number;
    let sessionTimeout: number;

    const resetTimeouts = () => {
      window.clearTimeout(warningTimeout);
      window.clearTimeout(sessionTimeout);

      // Set warning before session expires
      warningTimeout = window.setTimeout(() => {
        toast.warning("Your session will expire soon", {
          description: "Please save your work. You will be logged out in 5 minutes.",
          duration: 10000,
        });
      }, INACTIVITY_WARNING);

      // Set session timeout
      sessionTimeout = window.setTimeout(() => {
        handleSignOut();
        toast.error("Session expired", {
          description: "You have been logged out due to inactivity.",
        });
      }, SESSION_TIMEOUT);
    };

    // Reset timeouts on any user activity
    const activityEvents = ['mousedown', 'keydown', 'mousemove', 'touchstart'];
    const handleActivity = () => resetTimeouts();
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timeouts
    resetTimeouts();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      window.clearTimeout(warningTimeout);
      window.clearTimeout(sessionTimeout);
    };
  }, [user, handleSignOut]);

  // Update user role when user changes
  useEffect(() => {
    if (user) {
      fetchUserRole(user.id);
    }
  }, [user, fetchUserRole]);

  // Update organization when user changes
  useEffect(() => {
    if (user?.user_metadata?.current_organization_id) {
      switchOrganization(user.user_metadata.current_organization_id);
    }
  }, [user, switchOrganization]);

  // Log authentication events for security audit
  useEffect(() => {
    const logAuthEvent = async (eventType: string, metadata: any = {}) => {
      if (!user) return;

      try {
        await supabase.rpc('log_admin_action', {
          action_type: eventType,
          entity_type: 'auth',
          entity_id: user.id,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
          }
        });
      } catch (error) {
        console.error('Failed to log auth event:', error);
      }
    };

    if (user) {
      logAuthEvent('session_started');
    }

    return () => {
      if (user) {
        logAuthEvent('session_ended');
      }
    };
  }, [user]);

  const signOut = async () => {
    await handleSignOut();
    navigate("/auth");
  };

  const switchRole = async (role: UserRole) => {
    try {
      // Verify user has permission for the role
      const { data: hasRole, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', role)
        .single();

      if (error || !hasRole) {
        throw new Error('Unauthorized role switch attempt');
      }

      await handleSwitchRole(role);
      
      // Log role switch for audit
      await supabase.rpc('log_admin_action', {
        action_type: 'role_switch',
        entity_type: 'auth',
        entity_id: user?.id,
        metadata: { new_role: role }
      });

      toast.success(`Switched to ${role} role`);
      navigate("/"); // Reset to home page for new role context
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
