"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  AiOutlineSearch,
  AiOutlineCar,
  AiOutlineCalendar,
  AiOutlineUser
} from "react-icons/ai";

interface SearchParams {
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  seller: string;
  winner: string;
  orderBy: string;
  filterBy: string;
}

interface SearchResult {
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

interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  pageCount: number;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchTerm: "",
    pageNumber: 1,
    pageSize: 20,
    seller: "",
    winner: "",
    orderBy: "",
    filterBy: ""
  });
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchParams.searchTerm)
        params.append("searchTerm", searchParams.searchTerm);
      params.append("pageNumber", searchParams.pageNumber.toString());
      params.append("pageSize", searchParams.pageSize.toString());
      if (searchParams.seller) params.append("seller", searchParams.seller);
      if (searchParams.winner) params.append("winner", searchParams.winner);
      if (searchParams.orderBy) params.append("orderBy", searchParams.orderBy);
      if (searchParams.filterBy)
        params.append("filterBy", searchParams.filterBy);

      const url = `http://localhost:5175/search?${params.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResponse(data);
    } catch (error) {
      console.error("Search error:", error);
      setError(error instanceof Error ? error.message : "Search failed");
      setSearchResponse(null);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Search Cars
            </h1>
            <p className="text-xl text-gray-600">
              Find your perfect car by searching through our auction listings
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mb-8 bg-white rounded-lg shadow-md p-6"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Search Term */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Term
                </label>
                <input
                  type="text"
                  value={searchParams.searchTerm}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      searchTerm: e.target.value
                    })
                  }
                  placeholder="Search by make, model, year, or color..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Seller */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller
                </label>
                <input
                  type="text"
                  value={searchParams.seller}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, seller: e.target.value })
                  }
                  placeholder="Filter by seller"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Winner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Winner
                </label>
                <input
                  type="text"
                  value={searchParams.winner}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, winner: e.target.value })
                  }
                  placeholder="Filter by winner"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Order By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={searchParams.orderBy}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      orderBy: e.target.value
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Default (Ending Soon)</option>
                  <option value="make">Make (A-Z)</option>
                  <option value="new">Newest First</option>
                </select>
              </div>

              {/* Filter By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter By
                </label>
                <select
                  value={searchParams.filterBy}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      filterBy: e.target.value
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Live Auctions</option>
                  <option value="endingSoon">Ending Soon (6 hours)</option>
                  <option value="finished">Finished Auctions</option>
                </select>
              </div>

              {/* Page Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Results per Page
                </label>
                <select
                  value={searchParams.pageSize}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      pageSize: parseInt(e.target.value)
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <AiOutlineSearch size={20} />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Search Error
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching auctions...</p>
            </div>
          )}

          {/* Search Results */}
          {searchResponse && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Search Results
                </h2>
                <div className="text-gray-600">
                  Found {searchResponse.totalCount} result(s)
                </div>
              </div>

              {searchResponse.results.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResponse.results.map((auction) => (
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
                            <p className="text-sm text-gray-600">
                              {auction.color}
                            </p>
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
                            <span className="text-sm text-gray-600">
                              Current Bid:
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(auction.currentHighBid)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-600">
                              Reserve Price:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(auction.reservePrice)}
                            </span>
                          </div>

                          {/* Auction End Time */}
                          <div className="flex items-center text-sm text-gray-600 mb-4">
                            <AiOutlineCalendar className="mr-2" size={16} />
                            Ends: {formatDate(auction.auctionEnd)}
                          </div>

                          {/* View Details Button */}
                          <button
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/auction/${auction.id}`;
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <AiOutlineSearch className="mx-auto text-gray-400 text-6xl mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Results Found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or browse all auctions
                    instead.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No Search Yet */}
          {!searchResponse && !loading && !error && (
            <div className="text-center py-20">
              <AiOutlineSearch className="mx-auto text-gray-400 text-6xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Start Your Search
              </h3>
              <p className="text-gray-500">
                Enter search terms above to find the perfect car for you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
