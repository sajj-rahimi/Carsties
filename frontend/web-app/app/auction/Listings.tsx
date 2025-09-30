"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AiOutlineCar,
  AiOutlineUser,
  AiOutlineDollar,
  AiOutlineCalendar
} from "react-icons/ai";

interface Auction {
  id: string;
  reservePrice: number;
  seller: string;
  winner: string;
  soldAmount: number;
  currentHighBid: number;
  createdAt: string;
  updatedAt: string;
  auctionEnd: string;
  status: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
}

export default function AuctionListings() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        // Using the gateway service URL from docker-compose
        const response = await fetch("http://localhost:5175/auctions");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAuctions(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch auctions"
        );
        console.error("Error fetching auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "live":
        return "bg-green-100 text-green-800";
      case "finished":
        return "bg-gray-100 text-gray-800";
      case "reserveNotMet":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Auctions
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-20">
        <AiOutlineCar className="mx-auto text-gray-400 text-6xl mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Auctions Available
        </h3>
        <p className="text-gray-500">
          Check back later for new auction listings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <Link
          key={auction.id}
          href={`/auction/${auction.id}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-red-300 group"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {auction.year} {auction.make} {auction.model}
                </h3>
                <p className="text-sm text-gray-600">{auction.color}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  auction.status
                )}`}
              >
                {auction.status}
              </span>
            </div>

            {/* Car Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <AiOutlineCar className="mr-2" size={16} />
                {auction.mileage.toLocaleString()} miles
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <AiOutlineUser className="mr-2" size={16} />
                Seller: {auction.seller || "Anonymous"}
              </div>
            </div>

            {/* Bidding Info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Current Bid:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(auction.currentHighBid)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Reserve Price:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(auction.reservePrice)}
                </span>
              </div>

              {/* Auction End Time */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <AiOutlineCalendar className="mr-2" size={16} />
                Ends: {formatDate(auction.auctionEnd)}
              </div>

              {/* Bid Button */}
              <button
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle bid logic here
                }}
              >
                Place Bid
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
