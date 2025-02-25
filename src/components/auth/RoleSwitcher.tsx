
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from 'lucide-react';
import type { UserRole } from '@/lib/types/auth';

export function RoleSwitcher() {
  const { user, userRole, switchRole } = useAuth();
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user?.id) return;
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (roles) {
        setAvailableRoles(roles.map(r => r.role));
      }
    };

    fetchUserRoles();
  }, [user?.id]);

  if (availableRoles.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Shield className="h-4 w-4 text-muted-foreground" />
      <Select
        value={userRole}
        onValueChange={(role) => switchRole(role as UserRole)}
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
