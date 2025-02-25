
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdvancedSearchForm } from '@/components/search/AdvancedSearchForm';
import { VehicleSearchResults } from '@/components/search/VehicleSearchResults';
import { toast } from '@/components/ui/use-toast';
import type { VehicleStatus, VehicleCondition, Vehicle } from '@/lib/types/vehicles';

interface SearchCriteria {
  make?: string;
  model?: string;
  year?: string;
  vin?: string;
  status?: VehicleStatus;
  location?: string;
  condition?: VehicleCondition;
}

export default function VehicleSearch() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', searchCriteria],
    queryFn: async () => {
      let query = supabase
        .from('inventory_vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters based on search criteria
      if (searchCriteria.make) {
        query = query.ilike('make', `%${searchCriteria.make}%`);
      }
      if (searchCriteria.model) {
        query = query.ilike('model', `%${searchCriteria.model}%`);
      }
      if (searchCriteria.year) {
        query = query.eq('year', parseInt(searchCriteria.year));
      }
      if (searchCriteria.vin) {
        query = query.ilike('vin', `%${searchCriteria.vin}%`);
      }
      if (searchCriteria.status) {
        query = query.eq('status', searchCriteria.status);
      }
      if (searchCriteria.condition) {
        query = query.eq('condition', searchCriteria.condition);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch vehicles. Please try again.",
        });
        throw error;
      }

      return data as Vehicle[];
    },
  });

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Vehicle Search</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <AdvancedSearchForm onSearch={handleSearch} />
      </div>

      <VehicleSearchResults 
        vehicles={vehicles} 
        isLoading={isLoading}
      />
    </div>
  );
}
