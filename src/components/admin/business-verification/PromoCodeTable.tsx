
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PromoCode {
  id: string;
  code: string;
  type: string;
  description: string;
  trial_days: number;
  max_uses: number;
  times_used: number;
  expires_at: string;
  is_active: boolean;
}

const columns = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "trial_days",
    header: "Trial Days",
  },
  {
    accessorKey: "times_used",
    header: "Times Used",
  },
  {
    accessorKey: "max_uses",
    header: "Max Uses",
  },
  {
    accessorKey: "expires_at",
    header: "Expires At",
    cell: ({ row }: { row: any }) => {
      const date = new Date(row.getValue("expires_at"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }: { row: any }) => (
      <span className={row.getValue("is_active") ? "text-green-500" : "text-red-500"}>
        {row.getValue("is_active") ? "Yes" : "No"}
      </span>
    ),
  },
];

export function PromoCodeTable() {
  const { data: promoCodes } = useQuery({
    queryKey: ["promo-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PromoCode[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Promo Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={promoCodes || []}
        />
      </CardContent>
    </Card>
  );
}
