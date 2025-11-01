"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { ProductForm } from "./ProductForm";
import { ProductCard } from "./ProductCard";

export function ProductsManager() {
  // Removed TypeScript type annotations for useState
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Premium Wireless Headphones",
      description: "High-quality sound with noise cancellation",
      price: 199.99,
      image: "/wireless-headphones.jpg",
    },
    {
      id: "2",
      name: "Smart Watch",
      description: "Track fitness, receive notifications, and check the time",
      price: 299.99,
      image: "/smart-watch.jpg",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = product => {
    if (editingId) {
      setProducts(
        products.map(p =>
          p.id === editingId ? { ...product, id: editingId } : p
        )
      );
      setEditingId(null);
      setEditingProduct(null);
    } else {
      const newProduct = {
        ...product,
        id: Date.now().toString(),
      };
      setProducts([...products, newProduct]);
    }
    setIsFormOpen(false);
  };

  const handleEdit = product => {
    setEditingProduct(product);
    setEditingId(product.id);
    setIsFormOpen(true);
  };

  const handleDelete = id => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Products</h2>
          <p className="text-slate-400">
            Create, update, and manage your product inventory
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add Product
          </button>
        )}
      </div>

      {isFormOpen && (
        <ProductForm
          initialProduct={editingProduct}
          onSubmit={handleAddProduct}
          onCancel={handleCancel}
          isEditing={!!editingId}
        />
      )}

      {products.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
          <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">
            No products yet. Create your first product to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
