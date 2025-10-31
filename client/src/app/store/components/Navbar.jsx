"use client";
import { Search, User, ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-3xl font-extrabold text-gray-700">X</span>
        <span className="text-3xl font-extrabold text-gray-900">POGE</span>
      </div>

      {/* Menu */}
      <ul className="flex space-x-8 text-sm font-medium text-gray-700">
        <li className="hover:text-black cursor-pointer">HOME</li>
        <li className="hover:text-black cursor-pointer">PAGES</li>
        <li className="hover:text-black cursor-pointer">SHOP</li>
        <li className="hover:text-black cursor-pointer">BLOG</li>
        <li className="hover:text-black cursor-pointer">CONTACT</li>
      </ul>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Search box */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search text"
            className="bg-transparent outline-none text-sm w-40"
          />
          <Search className="text-gray-600 ml-2 w-4 h-4 cursor-pointer" />
        </div>

        {/* Icons */}
        <button className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center">
          <User size={18} />
        </button>
        <button className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center">
          <ShoppingBag size={18} />
        </button>
      </div>
    </nav>
  );
}
