
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { VehicleStatus, VehicleCondition } from '@/lib/types/vehicles';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: VehicleStatus;
  condition: VehicleCondition;
  location?: string;
}

interface VehicleSearchResultsProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export function VehicleSearchResults({ vehicles, isLoading }: VehicleSearchResultsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-8">Loading vehicles...</div>;
  }

  if (!vehicles.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No vehicles found matching your search criteria
      </div>
    );
  }

  const getStatusColor = (status: VehicleStatus): "default" | "destructive" | "outline" | "secondary" => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'secondary';
      case 'in_transit':
        return 'default';
      case 'sold':
        return 'secondary';
      case 'maintenance':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Make/Model</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>VIN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                {vehicle.make} {vehicle.model}
              </TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>
                <span className="font-mono">{vehicle.vin}</span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{vehicle.condition}</Badge>
              </TableCell>
              <TableCell>{vehicle.location || 'N/A'}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/inventory/vehicles/${vehicle.id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
