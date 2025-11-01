"use client";

import React, { useState } from "react";
import { Save, Mail, StoreIcon } from "lucide-react";

export function StoreSettings({ storeName, setStoreName }) {
  const [formData, setFormData] = useState({
    storeName: storeName,
    email: "contact@store.com",
    storeDetails:
      "Welcome to our store! We offer premium quality products at affordable prices.",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStoreName(formData.storeName);
    setIsSaving(false);
    console.log("Store settings saved:", formData);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Store Settings</h2>
        <p className="text-slate-400">
          Manage your store information and details
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Store Name */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
          <label
            htmlFor="storeName"
            className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3"
          >
            <StoreIcon className="w-4 h-4 text-blue-400" />
            Store Name
          </label>
          <input
            id="storeName"
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            placeholder="Enter store name"
          />
        </div>

        {/* Email */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            placeholder="Enter email address"
          />
        </div>

        {/* Store Details */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
          <label
            htmlFor="storeDetails"
            className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3"
          >
            <StoreIcon className="w-4 h-4 text-blue-400" />
            Store Details
          </label>
          <textarea
            id="storeDetails"
            name="storeDetails"
            value={formData.storeDetails}
            onChange={handleChange}
            rows={6}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
            placeholder="Enter store details and description"
          />
          <p className="text-xs text-slate-500 mt-2">
            {formData.storeDetails.length}/500 characters
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-linear-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all group"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
