"use client";

import React, { useState } from "react"; // Ensure React is imported for React.ChangeEvent etc.
import { Save, X, Upload } from "lucide-react";

export function ProductForm({ initialProduct, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || 0,
    image: initialProduct?.image || "",
  });

  const [previewImage, setPreviewImage] = useState(initialProduct?.image || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) : value,
    }));
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Cast reader.result to string, as in the original TSX logic
        const result = reader.result;
        setPreviewImage(result);
        setFormData(prev => ({
          ...prev,
          image: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      formData.price <= 0 ||
      !formData.image
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit(formData);
    setIsSaving(false);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          {isEditing ? "Edit Product" : "Create New Product"}
        </h3>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Upload */}
          <div className="lg:col-span-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
              <Upload className="w-4 h-4 text-blue-400" />
              Product Image
            </label>
            <div className="relative">
              {previewImage ? (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <label className="w-full aspect-square rounded-lg bg-slate-800 border-2 border-dashed border-slate-700 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Click to upload</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="text-sm font-semibold text-slate-200 mb-2 block"
              >
                Product Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                placeholder="Enter product name"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="text-sm font-semibold text-slate-200 mb-2 block"
              >
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="text-sm font-semibold text-slate-200 mb-2 block"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                placeholder="Enter product description"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            {isSaving
              ? "Saving..."
              : isEditing
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
