
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuctions } from "@/lib/api/auctions";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Gavel } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuctionsPage() {
  const { organization } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: auctions, isLoading } = useQuery({
    queryKey: ['auctions'],
    queryFn: getAuctions,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error loading auctions",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Auctions</h1>
        {organization && (
          <Button onClick={() => navigate("/auctions/create")}>
            <Gavel className="mr-2 h-4 w-4" />
            Create Auction
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {auctions?.map((auction) => (
          <Card key={auction.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/auctions/${auction.id}`)}>
            <CardHeader>
              <CardTitle>{auction.title}</CardTitle>
              <CardDescription>
                {new Date(auction.start_time).toLocaleDateString()} - {new Date(auction.end_time).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{auction.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Status: {auction.status}
                  </span>
                  <span className="text-sm">
                    {auction.items?.length || 0} vehicles
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {auctions?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No auctions found</h3>
          <p className="text-muted-foreground">Check back later for upcoming auctions.</p>
        </div>
      )}
    </div>
  );
}
