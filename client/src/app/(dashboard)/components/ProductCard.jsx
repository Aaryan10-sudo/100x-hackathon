"use client";

import { Edit2, Trash2, DollarSign } from "lucide-react";
import React from "react"; // Explicitly import React

export function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group">
      {/* Image */}
      <div className="relative w-full aspect-square bg-slate-800 overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-2xl font-bold text-white">
            {product.price.toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-700">
          <button
            onClick={onEdit}
            className="flex-1 bg-blue-600/20 cursor-pointer hover:bg-blue-600/30 text-blue-400 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-600/20 cursor-pointer hover:bg-red-600/30 text-red-400 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
