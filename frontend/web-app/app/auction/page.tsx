import AuctionListings from "./Listings";

export default function AuctionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Live Auctions
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing cars available for auction. Bid on your dream
            vehicle today!
          </p>
        </div>
        <AuctionListings />
      </div>
    </div>
  );
}



