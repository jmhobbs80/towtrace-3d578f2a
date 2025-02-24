
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { searchVehicles } from "@/lib/api/vehicles";
import type { VehicleSearchFilters } from "@/lib/types/vehicles";

export default function VehicleSearch() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<VehicleSearchFilters>({});

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => searchVehicles(filters),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'in_transit':
        return 'secondary';
      case 'pending_inspection':
        return 'outline';
      case 'sold':
        return 'default';
      case 'auction_ready':
        return 'secondary';
      case 'maintenance':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Vehicle Search</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Search by VIN"
          value={filters.vin || ''}
          onChange={(e) => setFilters(f => ({ ...f, vin: e.target.value }))}
        />
        <Input
          placeholder="Make"
          value={filters.make || ''}
          onChange={(e) => setFilters(f => ({ ...f, make: e.target.value }))}
        />
        <Input
          placeholder="Model"
          value={filters.model || ''}
          onChange={(e) => setFilters(f => ({ ...f, model: e.target.value }))}
        />
        <Select
          value={filters.status}
          onValueChange={(value: any) => setFilters(f => ({ ...f, status: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="needs_repair">Needs Repair</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>VIN</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading vehicles...
                </TableCell>
              </TableRow>
            ) : vehicles?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No vehicles found
                </TableCell>
              </TableRow>
            ) : (
              vehicles?.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
