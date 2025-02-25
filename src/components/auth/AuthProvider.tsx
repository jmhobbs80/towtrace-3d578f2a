
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/types/auth";
import type { Database } from "@/integrations/supabase/types";

type OrganizationType = Database['public']['Enums']['organization_type'];

interface BillingDetails {
  name?: string;
  email?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  subscription_tier: string;
  subscription_status: string;
  subscription_period_end?: string;
  stripe_customer_id?: string;
  subscription_plan_id?: string;
  member_count?: number;
  vehicle_count?: number;
  billing_details?: BillingDetails;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  organization: Organization | null;
  userRole: UserRole | null;
  signOut: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  organization: null,
  userRole: null,
  signOut: async () => {},
  switchOrganization: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      if (data) {
        setUserRole(data.role as UserRole);
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  const switchOrganization = async (orgId: string) => {
    try {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        return;
      }

      if (org) {
        const formattedOrg: Organization = {
          id: org.id,
          name: org.name,
          type: org.type,
          subscription_tier: org.subscription_tier,
          subscription_status: org.subscription_status,
          subscription_period_end: org.subscription_period_end,
          stripe_customer_id: org.stripe_customer_id,
          subscription_plan_id: org.subscription_plan_id,
          member_count: org.member_count || 0,
          vehicle_count: org.vehicle_count || 0,
          billing_details: org.billing_details as BillingDetails
        };
        setOrganization(formattedOrg);
        
        await supabase.auth.updateUser({
          data: { current_organization_id: orgId }
        });
      }
    } catch (error) {
      console.error('Error switching organization:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to switch organization. Please try again.",
      });
    }
  };

  const attemptReconnect = useCallback(async () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setIsReconnecting(false);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to restore session. Please sign in again.",
      });
      navigate("/auth");
      return;
    }

    setIsReconnecting(true);
    reconnectAttempts.current += 1;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id);
        const currentOrgId = session.user.user_metadata.current_organization_id;
        if (currentOrgId) {
          await switchOrganization(currentOrgId);
        }
        setIsReconnecting(false);
        reconnectAttempts.current = 0;
        
        toast({
          title: "Session Restored",
          description: "Your session has been successfully restored.",
        });
      }
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
      setTimeout(attemptReconnect, Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000));
    }
  }, [navigate]);

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden && !user) {
      attemptReconnect();
    }
  }, [user, attemptReconnect]);

  const handleOnline = useCallback(() => {
    if (!user) {
      attemptReconnect();
    }
  }, [user, attemptReconnect]);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
          const currentOrgId = session.user.user_metadata.current_organization_id;
          if (currentOrgId) {
            await switchOrganization(currentOrgId);
          }
        }
      } catch (error) {
        console.error('Auth setup error:', error);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserRole(session.user.id);
        const currentOrgId = session.user.user_metadata.current_organization_id;
        if (currentOrgId) {
          await switchOrganization(currentOrgId);
        }
      } else {
        setOrganization(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    // Set up network and visibility event listeners
    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up periodic session check
    const sessionCheckInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && user) {
        attemptReconnect();
      }
    }, 60000); // Check every minute

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(sessionCheckInterval);
    };
  }, [user, handleOnline, handleVisibilityChange, attemptReconnect]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, organization, userRole, signOut, switchOrganization }}>
      {isReconnecting && (
        <div className="fixed top-0 left-0 right-0 bg-primary/90 text-white py-2 text-center text-sm">
          Attempting to restore your session... {reconnectAttempts.current}/{maxReconnectAttempts}
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
