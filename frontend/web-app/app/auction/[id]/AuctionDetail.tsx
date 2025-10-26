"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AiOutlineCar,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineDollar,
  AiOutlineArrowLeft
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

interface AuctionDetailProps {
  auctionId: string;
}

export default function AuctionDetail({ auctionId }: AuctionDetailProps) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5175/auctions/${auctionId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAuction(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch auction details"
        );
        console.error("Error fetching auction:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId]);

  useEffect(() => {
    if (!auction) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.auctionEnd).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft("Auction Ended");
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction]);

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
      month: "long",
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Auction
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/auction"
                className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Back to Auctions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AiOutlineCar className="mx-auto text-gray-400 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Auction Not Found
          </h3>
          <p className="text-gray-500 mb-4">
            The auction you're looking for doesn't exist.
          </p>
          <Link
            href="/auction"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <AiOutlineArrowLeft className="mr-2" size={16} />
            Back to Auctions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/auction"
          className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors mb-6"
        >
          <AiOutlineArrowLeft className="mr-2" size={16} />
          Back to Auctions
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Car Image & Basic Info */}
          <div className="space-y-6">
            {/* Car Image Placeholder */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <AiOutlineCar className="mx-auto text-gray-400 text-6xl mb-2" />
                  <p className="text-gray-500">Car Image</p>
                </div>
              </div>
            </div>

            {/* Car Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vehicle Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Make & Model:</span>
                  <span className="font-semibold">
                    {auction.year} {auction.make} {auction.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-semibold">{auction.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-semibold">
                    {auction.mileage.toLocaleString()} miles
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-semibold">
                    {auction.seller || "Anonymous"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bidding Info */}
          <div className="space-y-6">
            {/* Auction Status & Time */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {auction.year} {auction.make} {auction.model}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    auction.status
                  )}`}
                >
                  {auction.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <AiOutlineCalendar className="mr-2" size={18} />
                  <span>Ends: {formatDate(auction.auctionEnd)}</span>
                </div>

                {auction.status.toLowerCase() === "live" && (
                  <div className="flex items-center text-red-600 font-semibold">
                    <AiOutlineCalendar className="mr-2" size={18} />
                    <span>Time Left: {timeLeft}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bidding Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bidding Information
              </h2>

              <div className="space-y-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">
                    Current High Bid
                  </div>
                  <div className="text-4xl font-bold text-green-600">
                    {formatCurrency(auction.currentHighBid)}
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Reserve Price:</span>
                  <span className="font-semibold">
                    {formatCurrency(auction.reservePrice)}
                  </span>
                </div>

                {auction.winner && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Winner:</span>
                    <span className="font-semibold">{auction.winner}</span>
                  </div>
                )}

                {auction.soldAmount > 0 && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600">Sold Amount:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(auction.soldAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Bid Button */}
              {auction.status.toLowerCase() === "live" && (
                <div className="mt-6">
                  <button className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg">
                    Place Bid
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    You'll be redirected to the bidding interface
                  </p>
                </div>
              )}
            </div>

            {/* Auction Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Auction Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Auction Started:</span>
                  <span>{formatDate(auction.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span>{formatDate(auction.updatedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Auction Ends:</span>
                  <span>{formatDate(auction.auctionEnd)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
