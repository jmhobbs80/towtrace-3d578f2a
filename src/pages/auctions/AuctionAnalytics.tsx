
import { useParams } from "react-router-dom";
import { AuctionPerformanceDashboard } from "@/components/auction/AuctionPerformanceDashboard";

export default function AuctionAnalytics() {
  const { auctionId } = useParams();

  if (!auctionId) {
    return <div>Auction ID is required</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Auction Analytics</h1>
      <AuctionPerformanceDashboard auctionId={auctionId} />
    </div>
  );
}
