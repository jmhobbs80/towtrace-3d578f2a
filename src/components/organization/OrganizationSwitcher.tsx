
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
import { Building } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type OrganizationType = Database['public']['Enums']['organization_type'];

interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
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
            type
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      return memberships.map(m => m.organizations) as Organization[];
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
            <SelectItem key={org.id} value={org.id}>
              {org.name} ({org.type || 'Unknown'})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
