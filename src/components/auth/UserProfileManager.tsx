
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "@/lib/types/auth";

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

      if (data) {
        setUserRole(data.role as UserRole);
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  }, []);

  return {
    userRole,
    fetchUserRole
  };
};
