"use client";

import { useState } from "react";
import Sidebar from "../components/SiderBar";
import HeroSection from "../components/Hero";
import { StoreSettings } from "../components/StorteSettings";
import { ProductsManager } from "../components/ProductManager";
import Analytics from "../components/Analytics";

export default function Dashboard() {
  // Removed TypeScript type annotation
  const [activeTab, setActiveTab] = useState("home");
  const [storeName, setStoreName] = useState("My Awesome Store");

  return (
    <div className="min-h-screen w-full absolute z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storeName={storeName}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "home" && (
          <HeroSection
            storeName={storeName}
            setStoreName={setStoreName}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "store" && (
          <div className="p-8">
            <StoreSettings storeName={storeName} setStoreName={setStoreName} />
          </div>
        )}
        {activeTab === "products" && (
          <div className="p-8">
            <ProductsManager />
          </div>
        )}
      </div>
    </div>
  );
}
