import React from "react";
import { AiOutlineCar } from "react-icons/ai";
export default function Navbar() {
  return (
    <header className="stocky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md">
      <div className="flex items-center justify-between gap-2 font-semibold text-3xl text-red-400">
        <AiOutlineCar size={34} />
        Carsties Auctions
      </div>
      <div>Search</div>
      <div>Login</div>
    </header>
  );
}
