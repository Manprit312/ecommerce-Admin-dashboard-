"use client";

import { useEffect, useState } from "react";
import { Loader2, Edit3, Check, XCircle, Package } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function ProductInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedStock, setUpdatedStock] = useState<number | null>(null);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${apiUrl}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Save stock update
  const handleSaveStock = async (id: string) => {
    if (updatedStock === null) return;
    try {
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: updatedStock }),
      });
      if (!res.ok) throw new Error("Failed to update stock");

      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, stock: updatedStock } : p
        )
      );
      setEditingId(null);
      setUpdatedStock(null);
    } catch (err) {
      alert("❌ Error updating stock");
    }
  };

  // Total inventory value
  const totalValue = products.reduce(
    (acc, p) => acc + (p.price || 0) * (p.stock || 0),
    0
  );

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading inventory...
      </div>
    );
  }

  return (
    <DefaultLayout>
    <div className=" mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-[#1daa61]" />
          Product Inventory
        </h1>
        <div className="text-gray-600 text-sm">
          Manage stock levels and monitor your inventory health.
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Total Inventory Value
        </h2>
        <p className="text-2xl font-bold text-[#1daa61]">
          ${totalValue.toFixed(2)}
        </p>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Product</th>
              <th className="px-6 py-3 font-medium text-gray-500">Price</th>
              <th className="px-6 py-3 font-medium text-gray-500">Stock</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover border"
                    />
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    ${product.price?.toFixed(2) || "—"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {editingId === product._id ? (
                      <input
                        type="number"
                        min={0}
                        value={updatedStock ?? product.stock ?? 0}
                        onChange={(e) =>
                          setUpdatedStock(Number(e.target.value))
                        }
                        className="w-20 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#1daa61]"
                      />
                    ) : (
                      product.stock ?? "—"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        (product.stock ?? 0) <= 0
                          ? "bg-red-100 text-red-600"
                          : product.stock < 10
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stock <= 0
                        ? "Out of Stock"
                        : product.stock < 10
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    {editingId === product._id ? (
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleSaveStock(product._id)}
                          className="text-[#1daa61] hover:text-green-700"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setUpdatedStock(null);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(product._id);
                          setUpdatedStock(product.stock);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </DefaultLayout>
  );
}
