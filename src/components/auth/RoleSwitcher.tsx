
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from 'lucide-react';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { toast } from 'sonner';
import type { UserRole } from '@/lib/types/auth';

export function RoleSwitcher() {
  const { user, userRole, switchRole } = useAuth();
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user?.id) return;
      
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        if (roles) {
          const validRoles = roles
            .map(r => r.role)
            .filter((role): role is UserRole => {
              return ['admin', 'dispatcher', 'provider', 'dealer', 'wholesaler', 
                     'overwatch_admin', 'super_admin', 'support_agent', 
                     'billing_manager', 'consumer', 'fleet_manager', 'driver'].includes(role);
            });
          setAvailableRoles(validRoles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to load user roles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user?.id]);

  const handleRoleChange = async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      await switchRole(newRole);
      toast.success(`Switched to ${newRole} role`);
      navigate('/'); // Reset to home page when role changes
    } catch (error) {
      console.error('Role switch error:', error);
      toast.error('Failed to switch roles');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <div className="w-full h-9 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  if (availableRoles.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Shield className="h-4 w-4 text-muted-foreground" />
      <Select
        value={userRole ?? undefined}
        onValueChange={handleRoleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => (
            <SelectItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
