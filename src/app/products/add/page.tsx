"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { toast, Toaster } from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    categories: [""],
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

  // 🔹 Generic input handler
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Specs input handler
  const handleSpecsChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, [key]: value },
    }));
  };

  // 🔹 Dynamic features
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

  // 🔹 Dynamic categories
  const handleCategoryChange = (index: number, value: string) => {
    const categories = [...form.categories];
    categories[index] = value;
    setForm((prev) => ({ ...prev, categories }));
  };

  const addCategory = () =>
    setForm((prev) => ({ ...prev, categories: [...prev.categories, ""] }));

  const removeCategory = (index: number) => {
    const categories = form.categories.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, categories }));
  };

  // 🔹 Image upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const total = [...images, ...files];
    if (total.length > 10) {
      toast.error("You can upload up to 10 images only!");
      return;
    }

    const newFiles = [...images, ...files];
    setImages(newFiles);

    const newUrls = [...previewUrls, ...files.map((file) => URL.createObjectURL(file))];
    setPreviewUrls(newUrls);
  };

  // ❌ Remove single image before upload
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
    if (form.categories.length === 0 || !form.categories[0].trim()) return "At least one category required.";
    if (images.length === 0) return "Please upload at least one image.";
    return null;
  };

  // 🔹 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("categories", JSON.stringify(form.categories));
    formData.append("specs", JSON.stringify(form.specs));
    formData.append("rating", form.rating);
    formData.append("reviews", form.reviews);
    formData.append("inStock", String(form.inStock));
    formData.append("badge", form.badge);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("https://api.nextjs.aydpm.in/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      toast.success("✅ Product added successfully!");
      setTimeout(() => router.push("/products"), 1500);
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
          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
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
                required
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
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            {form.categories.map((cat, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <input
                  value={cat}
                  onChange={(e) => handleCategoryChange(i, e.target.value)}
                  placeholder="Category name"
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
                />
                {i > 0 && (
                  <button type="button" onClick={() => removeCategory(i)} className="text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center text-[#1daa61] font-medium mt-2"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </button>
          </div>

          {/* Specs */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
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
            <div className="flex flex-col gap-3">
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-3">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <img
                        src={url}
                        alt="preview"
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
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
          </div>

          {/* Misc Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <input
                name="badge"
                value={form.badge}
                onChange={handleChange}
                placeholder="e.g. Bestseller"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
              <input
                name="reviews"
                type="number"
                value={form.reviews}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
            </div>
          </div>

          {/* Stock */}
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
