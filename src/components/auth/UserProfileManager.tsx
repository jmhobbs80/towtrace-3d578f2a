
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "@/lib/types/auth";

const VALID_ROLES = ['admin', 'dispatcher', 'driver', 'dealer', 'wholesaler', 
                     'overwatch_admin', 'super_admin', 'support_agent', 
                     'billing_manager'] as const;

export const useUserProfileManager = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const fetchUserRole = useCallback(async (userId: string) => {
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

      const role = data?.role;
      if (role && VALID_ROLES.includes(role as UserRole)) {
        setUserRole(role as UserRole);
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  }, []);

  const switchRole = useCallback(async (newRole: UserRole) => {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser?.user?.id) throw new Error("No authenticated user");

    // Verify user has the role they're trying to switch to
    const { data: roleCheck } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.user.id)
      .eq('role', newRole)
      .maybeSingle();

    if (!roleCheck) throw new Error("User does not have permission for this role");

    setUserRole(newRole);
  }, []);

  return {
    userRole,
    fetchUserRole,
    switchRole
  };
};
