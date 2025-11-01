"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import React from "react"; // Explicitly import React

export default function HeroSection({ storeName, setStoreName, setActiveTab }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Header with Logo */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {storeName}
            </h1>
            <p className="text-slate-400 mt-2">
              Welcome to your store dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Welcome to StorePro
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Manage Your Store with Ease
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Complete control over your store settings and product inventory.
              Create, update, and manage your products with beautiful images and
              detailed descriptions.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setActiveTab("products")}
              className="w-full md:w-auto flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all group"
            >
              <span>Manage Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab("store")}
              className="w-full md:w-auto flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              <span>Store Settings</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section - Store Info Preview */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-white">Store Overview</h3>

            {/* Quick Edit Store Name */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Products</p>
                <p className="text-2xl font-bold text-blue-400">2</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Status</p>
                <p className="text-lg font-bold text-green-400">Active</p>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                ✨ Tip: Edit your store settings and add products to get
                started!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
