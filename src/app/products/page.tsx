"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export default function AllProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("https://api.nextjs.aydpm.in/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((p) =>
          p.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, products]);

  return (
     <DefaultLayout>
    <div >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">All Products</h1>

        <Link
          href="/products/add"
          className="mt-3 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-[#1daa61] text-white font-medium rounded-lg shadow-sm hover:bg-[#18b066] transition"
        >
          <PlusCircle className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1daa61] outline-none"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-red-500">
          Failed to load products: {error}
        </div>
      )}

      {/* Products Table */}
      {!loading && !error && (
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
              {filtered.length > 0 ? (
                filtered.map((product: any) => (
                  <tr key={product.id || product._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Image
                        src={
                          product.images[0] 
                        }
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      ${product.price?.toFixed(2) || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {product.stock ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          product.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.status || "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/products/edit/${product.id || product._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => alert(`Delete ${product.name}?`)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
      )}
    </div>
    </DefaultLayout>
  );
}
