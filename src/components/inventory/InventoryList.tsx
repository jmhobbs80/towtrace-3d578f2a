
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { InventoryVehicle } from "@/lib/types/inventory";

const columns = [
  {
    accessorKey: "vin",
    header: "VIN",
  },
  {
    accessorKey: "make",
    header: "Make",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge>{status.replace("_", " ")}</Badge>;
    },
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => {
      const condition = row.getValue("condition") as string;
      return condition ? <Badge variant="outline">{condition}</Badge> : null;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original as InventoryVehicle;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // TODO: Implement vehicle details view
            console.log("View vehicle:", vehicle.id);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      );
    },
  },
];

interface InventoryListProps {
  vehicles: InventoryVehicle[];
  isLoading?: boolean;
}

export const InventoryList = ({ vehicles, isLoading }: InventoryListProps) => {
  if (isLoading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={vehicles}
    />
  );
};
