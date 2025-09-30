"use client";
import React from "react";
import Link from "next/link";
import { AiOutlineCar, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors"
          >
            <AiOutlineCar size={32} />
            <span className="font-bold text-2xl">Carsties</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/auction"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Auctions
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Search
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
              <AiOutlineSearch size={20} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors font-medium">
              <AiOutlineUser size={18} />
              <span className="hidden sm:inline">Login</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2"
            >
              Home
            </Link>
            <Link
              href="/auction"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2"
            >
              Auctions
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium py-2"
            >
              Search
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
