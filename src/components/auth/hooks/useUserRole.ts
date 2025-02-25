
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useUserRole(userId?: string) {
  const [isOverwatchAdmin, setIsOverwatchAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        
        const isAdmin = data?.role === 'overwatch_admin';
        setIsOverwatchAdmin(isAdmin);

        if (isAdmin) {
          toast({
            variant: "destructive",
            title: "2FA Required",
            description: "As an Overwatch Admin, you must enable two-factor authentication.",
            duration: 0
          });
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkUserRole();
  }, [userId, toast]);

  return { isOverwatchAdmin };
}
