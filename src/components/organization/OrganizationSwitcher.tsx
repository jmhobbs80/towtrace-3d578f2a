
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Building, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/integrations/supabase/types';

type OrganizationType = Database['public']['Enums']['organization_type'];

interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  roles: {
    role_type: OrganizationType;
    is_primary: boolean;
  }[];
}

export function OrganizationSwitcher() {
  const { user, organization, switchOrganization } = useAuth();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(organization?.id || null);

  const { data: organizations = [] } = useQuery({
    queryKey: ['user-organizations'],
    queryFn: async () => {
      const { data: memberships, error } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          organizations (
            id,
            name,
            type,
            organization_roles (
              role_type,
              is_primary
            )
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      return memberships.map(m => ({
        ...m.organizations,
        roles: m.organizations.organization_roles || []
      })) as Organization[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (selectedOrgId) {
      switchOrganization(selectedOrgId);
    }
  }, [selectedOrgId, switchOrganization]);

  if (!organizations.length) return null;

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <Building className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedOrgId || undefined}
        onValueChange={setSelectedOrgId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem 
              key={org.id} 
              value={org.id}
              className="flex items-center gap-2"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {org.name}
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex flex-col gap-2">
                        <h4 className="font-semibold">Organization Roles</h4>
                        <div className="flex flex-wrap gap-1">
                          {org.roles.map((role, index) => (
                            <Badge 
                              key={index}
                              variant={role.is_primary ? "default" : "secondary"}
                            >
                              {role.role_type}
                              {role.is_primary && " (primary)"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="flex gap-1">
                  {org.roles.map((role, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="text-xs"
                    >
                      {role.role_type}
                    </Badge>
                  ))}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
