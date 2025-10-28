"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Trash2, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import toast from "react-hot-toast";
const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;
export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // ✅ Fetch product + categories
  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, catRes] = await Promise.all([
          fetch(`${apiUrl}products/${id}`),
          fetch(`${apiUrl}categories`),
        ]);

        if (!productRes.ok || !catRes.ok) throw new Error("Failed to fetch data");

        const [productData, catData] = await Promise.all([
          productRes.json(),
          catRes.json(),
        ]);

        setCategories(catData);
        setForm({
          ...productData,
          stockQuantity: productData.stockQuantity || 0,

          specs: {
            material: productData.specs?.material || "",
            dimensions: productData.specs?.dimensions || "",
            power: productData.specs?.power || "",
            features: productData.specs?.features?.length
              ? productData.specs.features
              : [""],
          },
          categories: productData.categories?.map((c: any) => c._id || c) || [],
          images: productData.images || [],
        });
      } catch (err) {
        toast.error("❌ Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  // ✅ Input handlers
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSpecsChange = (key: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      specs: { ...prev.specs, [key]: value },
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const features = [...form.specs.features];
    features[index] = value;
    setForm((prev: any) => ({
      ...prev,
      specs: { ...prev.specs, features },
    }));
  };

  const addFeature = () =>
    setForm((prev: any) => ({
      ...prev,
      specs: { ...prev.specs, features: [...prev.specs.features, ""] },
    }));

  const removeFeature = (index: number) => {
    const features = form.specs.features.filter((_: any, i: number) => i !== index);
    setForm((prev: any) => ({
      ...prev,
      specs: { ...prev.specs, features },
    }));
  };

  // ✅ Category selector (pill toggle)
  const handleCategorySelect = (id: string) => {
    setForm((prev: any) => {
      const selected = new Set(prev.categories);
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      return { ...prev, categories: Array.from(selected) };
    });
  };

  // ✅ Image handling
  const removeExistingImage = (index: number) => {
    const updated = form.images.filter((_: any, i: number) => i !== index);
    setForm((prev: any) => ({ ...prev, images: updated }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const allFiles = [...newImages, ...files];
    if (allFiles.length > 10) {
      toast.error("Max 10 images allowed!");
      return;
    }
    setNewImages(allFiles);
    const allPreviews = allFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(allPreviews);
  };

  const removeNewImage = (index: number) => {
    const updatedFiles = newImages.filter((_: any, i: number) => i !== index);
    const updatedPreviews = previewUrls.filter((_: any, i: number) => i !== index);
    setNewImages(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  // ✅ Validation
  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required";
    if (!form.price || Number(form.price) <= 0)
      return "Please enter a valid price greater than 0";
    if (!form.description.trim()) return "Description is required";
    if (!form.categories.length) return "Please select at least one category";
    if (form.stockQuantity === "" || Number(form.stockQuantity) < 0)
  return "Please enter a valid stock quantity";

    return null;
  };

  // ✅ Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

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
    formData.append("existingImages", JSON.stringify(form.images));
formData.append("stockQuantity", form.stockQuantity);

    newImages.forEach((file) => formData.append("images", file));

    toast.loading("Updating product...");

    try {
      const res = await fetch(`${apiUrl}products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update product");

      toast.dismiss();
      toast.success(" Product updated successfully!");
      router.push("/products");
    } catch (err: any) {
      toast.dismiss();
      toast.error("❌ " + err.message);
    }
  };

  // ✅ Loading states
  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading product...</div>;
  if (!form)
    return <div className="p-8 text-center text-gray-500">Product not found.</div>;

  // ✅ UI
  return (
    <DefaultLayout>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="text-gray-500 hover:text-[#1daa61] transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Edit Product</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs) *</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1daa61]"
              required
            />
          </div>

          {/* ✅ Category Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories *</label>
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

          {/* Existing Images */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Current Images</h3>
            <div className="flex flex-wrap gap-4">
              {form.images.map((url: string, i: number) => (
                <div key={i} className="relative group">
                  <img src={url} alt="Product" className="w-24 h-24 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-4 py-2 cursor-pointer focus:ring-2 focus:ring-[#1daa61]"
            />
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-3">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          {/* In Stock */}
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
            Update Product
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
}
