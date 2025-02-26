
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { InventoryVehicle } from "@/lib/types/inventory";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

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
          asChild
        >
          <a href={`/inventory/vehicles/${vehicle.id}`}>
            <Eye className="w-4 h-4" />
          </a>
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
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevious = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={paginatedVehicles}
      />
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <PaginationPrevious className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="px-4">
                  Page {currentPage} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <PaginationNext className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
