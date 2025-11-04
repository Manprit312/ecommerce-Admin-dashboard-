"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, PlusCircle, X } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { toast, Toaster } from "react-hot-toast";


const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;

export default function AllProductsPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@google/model-viewer");
    }
  }, []);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletePopup, setDeletePopup] = useState<null | string>(null); // store product ID to delete
  const router = useRouter();

  // 🔹 Fetch products
  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setFiltered(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("❌ Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }
  async function fetchCategories() {
    try {
      const res = await fetch(`${apiUrl}categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("❌ Failed to load categories");
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  useEffect(() => {
    let updated = [...products];

    // 🔍 search filter
    if (search.trim()) {
      updated = updated.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🏷️ category filter
    if (selectedCategory) {
      updated = updated.filter((p) =>
        p.categories?.some(
          (c: any) =>
            (typeof c === "string" && c === selectedCategory) ||
            (typeof c === "object" && c._id === selectedCategory)
        )
      );
    }

    setFiltered(updated);
  }, [search, selectedCategory, products]);


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

  // 🔹 Confirm delete popup action
const handleConfirmDelete = async () => {
  try {
    toast.loading("Deleting...", { id: "delete-toast" });

    if (deletePopup === "bulk") {
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`${apiUrl}products/${id}`, { method: "DELETE" })
        )
      );

      toast.success("✅ Selected products deleted!", { id: "delete-toast" });
      setSelectedProducts([]);
    } else {
      await fetch(`${apiUrl}products/${deletePopup}`, { method: "DELETE" });
      toast.success("✅ Product deleted!", { id: "delete-toast" });
    }

    setDeletePopup(null);
    fetchProducts();
  } catch (err: any) {
    toast.error("❌ " + err.message, { id: "delete-toast" });
    setDeletePopup(null);
  }
};


  return (
    <DefaultLayout>
      <Toaster position="top-right" />
      <div className="relative">
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
        <div className="relative mb-6 gap-20 flex justify-center sm:justify-start flex-wrap sm:flex-nowrap items-center gap-y-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1daa61] outline-none"
          />
         
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1daa61]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

      

        </div>
{selectedProducts.length > 0 && (
  <div className="mb-4 flex justify-end">
    <button
      onClick={() => setDeletePopup("bulk")}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
    >
      Delete Selected ({selectedProducts.length})
    </button>
  </div>
)}

        {/* Loading / Error */}
        {loading && (
          <div className="text-center py-12 text-gray-500">
            Loading products...
          </div>
        )}
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
    <th className="px-4 py-3">
      <input
        type="checkbox"
        checked={selectedProducts.length === filtered.length && filtered.length > 0}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedProducts(filtered.map((p) => p._id));
          } else {
            setSelectedProducts([]);
          }
        }}
      />
    </th>

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
                    <tr
                      key={product._id}
                      onClick={() => router.push(`/products/edit/${product._id}`)}
                      className="border-t hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-4 py-4">
          <input
            type="checkbox"
            checked={selectedProducts.includes(product._id)}
            onChange={(e) => {
              e.stopPropagation();
              setSelectedProducts((prev) =>
                prev.includes(product._id)
                  ? prev.filter((id) => id !== product._id)
                  : [...prev, product._id]
              );
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        {(() => {

                          const firstMedia =
                            product.model3D || product.images?.[0] || "https://via.placeholder.com/40";

                          // Detect 3D model files (case-insensitive)
                          const is3D =
                            typeof firstMedia === "string" &&
                            (firstMedia.toLowerCase().endsWith(".glb") ||
                              firstMedia.toLowerCase().endsWith(".gltf"));

                          if (is3D) {
                            // ✅ Show 3D model preview
                            return (
                              <model-viewer
                                src={firstMedia}
                                alt={product.name}
                                camera-controls
                                auto-rotate
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "0.25rem",
                                  background: "#f4f4f4",
                                  border: "1px solid #e5e7eb",
                                }}
                              ></model-viewer>
                            );
                          }

                          // ✅ Otherwise show regular image
                          return (
                            <Image
                              src={
                                firstMedia ||
                                "https://via.placeholder.com/40"
                              }
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          );
                        })()}

                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        Rs. {product.price?.toFixed(2) || "N/A"}
                      </td>

                      <td className="px-4 text-gray-700">
                        <label className="relative inline-flex items-center cursor-not-allowed">
                          <input
                            type="checkbox"
                            checked={!!product.inStock}
                            disabled
                            className="sr-only peer"
                          />
                          <div className="w-11 h-5 bg-red-500 peer-checked:bg-green-500 rounded-full transition-colors duration-300"></div>
                          <div className="absolute left-1 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </label>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${product.inStock 
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>

                      <td
                        className="px-6 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/products/edit/${product._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setDeletePopup(product._id)}
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

        {/* 🔹 Delete Confirmation Popup */}
        {deletePopup && (
          <div className="fixed inset-0  flex items-center justify-center z-1000">
            <div className="bg-gradient-to-r from-[#a1e2b9] to-white rounded-xl p-9 w-100 shadow-lg text-center relative">
              <button
                onClick={() => setDeletePopup(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Confirm Delete
              </h2>
              <p className="text-gray-600 mb-5">
                Are you sure you want to delete this product?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeletePopup(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
