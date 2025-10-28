"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { toast, Toaster } from "react-hot-toast";
const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;
export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]); // fetched categories
  const [form, setForm] = useState({
    name: "",
    stockQuantity: "",

    price: "",
    description: "",
    categories: [] as string[], // store selected category IDs
    rating: "",
    reviews: "",
    badge: "",
    inStock: true,
    specs: {
      material: "",
      dimensions: "",
      power: "",
      features: [""],
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}categories`);
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        toast.error("❌ Failed to load categories: " + err.message);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Input handlers
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecsChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, [key]: value },
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const features = [...form.specs.features];
    features[index] = value;
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, features },
    }));
  };

  const addFeature = () =>
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, features: [...prev.specs.features, ""] },
    }));

  const removeFeature = (index: number) => {
    const features = form.specs.features.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, features },
    }));
  };

  // ✅ Category selection handler
  const handleCategorySelect = (id: string) => {
    setForm((prev) => {
      const selected = new Set(prev.categories);
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      return { ...prev, categories: Array.from(selected) };
    });
  };

  // 🔹 Image Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const total = [...images, ...files];
    if (total.length > 24) {
      toast.error("You can upload up to 10 images only!");
      return;
    }

    const newFiles = [...images, ...files];
    setImages(newFiles);
    const newUrls = [...previewUrls, ...files.map((file) => URL.createObjectURL(file))];
    setPreviewUrls(newUrls);
  };

  const removeImage = (index: number) => {
    const newFiles = images.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newFiles);
    setPreviewUrls(newUrls);
  };

  // 🔹 Validation
  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.price || parseFloat(form.price) <= 0) return "Enter a valid price.";
    if (!form.description.trim()) return "Description is required.";
    if (form.categories.length === 0) return "Please select at least one category.";
    if (images.length === 0) return "Please upload at least one image.";
    if (form.stockQuantity === "" || parseInt(form.stockQuantity) < 0)
  return "Please enter a valid stock quantity.";

    return null;
  };

  // 🔹 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return toast.error(errorMsg);

    setLoading(true);
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "specs" || key === "categories") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    });
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(`${apiUrl}products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");
      toast.success("Product added successfully!");
      setTimeout(() => router.push("/products"), 1200);
    } catch (err: any) {
      toast.error("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Toaster position="top-right" />
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="text-gray-500 hover:text-[#1daa61] transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Add Product</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
            />
          </div>

          {/* ✅ Category Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-3">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat._id)}
                    className={`px-4 py-1 rounded-full border ${
                      form.categories.includes(cat._id)
                        ? "bg-[#1daa61] text-white border-[#1daa61]"
                        : "border-gray-300 text-gray-700 hover:border-[#1daa61]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No categories found.</p>
              )}
            </div>
          </div>

          {/* Specs */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Specifications</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <input
                placeholder="Material"
                value={form.specs.material}
                onChange={(e) => handleSpecsChange("material", e.target.value)}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
              <input
                placeholder="Dimensions"
                value={form.specs.dimensions}
                onChange={(e) => handleSpecsChange("dimensions", e.target.value)}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
              <input
                placeholder="Power"
                value={form.specs.power}
                onChange={(e) => handleSpecsChange("power", e.target.value)}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            {form.specs.features.map((f, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <input
                  value={f}
                  onChange={(e) => handleFeatureChange(i, e.target.value)}
                  placeholder="Feature name"
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
                />
                {i > 0 && (
                  <button type="button" onClick={() => removeFeature(i)} className="text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center text-[#1daa61] font-medium mt-2"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Feature
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-3">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Extra Fields */}
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              name="badge"
              placeholder="Badge (e.g. Bestseller)"
              value={form.badge}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
            />
            <input
              name="rating"
              type="number"
              placeholder="Rating"
              value={form.rating}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
            />
            <input
              name="reviews"
              type="number"
              placeholder="Reviews"
              value={form.reviews}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
            />
          </div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Stock Quantity
  </label>
  <input
    name="stockQuantity"
    type="number"
    min="0"
    value={form.stockQuantity}
    onChange={handleChange}
    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
    placeholder="Enter available quantity"
  />
</div>

          {/* Stock Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            />
            <span>In Stock</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full sm:w-auto px-6 py-2 text-white rounded-lg font-medium ${
              loading ? "bg-gray-400" : "bg-[#1daa61] hover:bg-[#18b066]"
            }`}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
}
