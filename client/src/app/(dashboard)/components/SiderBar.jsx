"use client";

import React from "react"; // Ensure React is imported
import { Home, Settings, Package, Eye, LogOut, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ activeTab, setActiveTab, storeName }) {
  const storeUrl = `/store/${storeName.toLowerCase().replace(/\s+/g, "-")}`;

  const navItems = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "home", label: "Dashboard", icon: Home },
    { id: "store", label: "Store Settings", icon: Settings },
    { id: "products", label: "Products", icon: Package },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">StorePro</h1>
            <p className="text-xs text-slate-400">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)} // Removed explicit type cast
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? "bg-blue-600/20 border border-blue-500/30 text-blue-400"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* View Website Section */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <Link
          href={storeUrl}
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all group w-full justify-center font-medium"
        >
          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>View My Website</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
