import AuctionDetail from "./AuctionDetail";

interface AuctionDetailPageProps {
  params: {
    id: string;
  };
}

export default function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  return <AuctionDetail auctionId={params.id} />;
}



