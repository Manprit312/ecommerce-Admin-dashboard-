"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

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
    images: [""],
  });

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

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, features: [...prev.specs.features, ""] },
    }));
  };

  const removeFeature = (index: number) => {
    const features = form.specs.features.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, features },
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const images = [...form.images];
    images[index] = value;
    setForm((prev) => ({ ...prev, images }));
  };

  const addImage = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImage = (index: number) => {
    const images = form.images.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images }));
  };

  const handleCategoryChange = (index: number, value: string) => {
    const categories = [...form.categories];
    categories[index] = value;
    setForm((prev) => ({ ...prev, categories }));
  };

  const addCategory = () => {
    setForm((prev) => ({ ...prev, categories: [...prev.categories, ""] }));
  };

  const removeCategory = (index: number) => {
    const categories = form.categories.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, categories }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://api.nextjs.aydpm.in/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add product");
      alert("✅ Product added successfully!");
      router.push("/products");
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  return (
    <DefaultLayout>
    <div className=" mx-auto">
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

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images (URLs)</label>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-3 mb-2">
              <input
                value={img}
                onChange={(e) => handleImageChange(i, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              />
              {i > 0 && (
                <button type="button" onClick={() => removeImage(i)} className="text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="flex items-center text-[#1daa61] font-medium mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Image
          </button>
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
          className="mt-4 w-full sm:w-auto px-6 py-2 bg-[#1daa61] hover:bg-[#18b066] text-white rounded-lg font-medium"
        >
          Save Product
        </button>
      </form>
    </div>
    </DefaultLayout>
  );
}
