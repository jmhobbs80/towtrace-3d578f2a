
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/lib/types/auth";

interface Organization {
  id: string;
  name: string;
  subscription_tier: string;
  subscription_status: string;
  subscription_period_end?: string;
  stripe_customer_id?: string;
  subscription_plan_id?: string;
  member_count?: number;
  vehicle_count?: number;
  billing_details?: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  organization: Organization | null;
  userRole: UserRole | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  organization: null,
  userRole: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return;
    }

    if (data) {
      setUserRole(data.role as UserRole);
    }
  };

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
        fetchUserOrganization(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
        fetchUserOrganization(session.user.id);
      } else {
        setOrganization(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserOrganization = async (userId: string) => {
    try {
      const { data: organizationMember, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', userId)
        .single();

      if (memberError) {
        console.error('Error fetching organization member:', memberError);
        return;
      }

      if (organizationMember?.organization_id) {
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', organizationMember.organization_id)
          .single();

        if (orgError) {
          console.error('Error fetching organization:', orgError);
          return;
        }

        if (org) {
          const formattedOrg: Organization = {
            id: org.id,
            name: org.name,
            subscription_tier: org.subscription_tier,
            subscription_status: org.subscription_status,
            subscription_period_end: org.subscription_period_end,
            stripe_customer_id: org.stripe_customer_id,
            subscription_plan_id: org.subscription_plan_id,
            member_count: org.member_count || 0,
            vehicle_count: org.vehicle_count || 0,
            billing_details: org.billing_details
          };
          setOrganization(formattedOrg);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserOrganization:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, loading, organization, userRole, signOut }}>
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
