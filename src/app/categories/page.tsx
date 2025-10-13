"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { PlusCircle, Edit, Trash2, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // ✅ Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("❌ Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Handle file input (preview + remove)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  };

  const removeSelectedImage = () => {
    setFile(null);
    setPreview(null);
  };

  // ✅ Handle save / update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("isActive", String(form.isActive));
    if (file) formData.append("image", file);

    try {
      const res = await fetch(
        editingId
          ? `${apiUrl}categories/${editingId}`
          : `${apiUrl}categories`,
        {
          method: editingId ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to save category");

      toast.success(editingId ? "✅ Category updated!" : "✅ Category created!");
      resetForm();
      fetchCategories();
    } catch (err: any) {
      toast.error("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", isActive: true });
    setFile(null);
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: any) => {
    setForm({
      name: cat.name,
      description: cat.description || "",
      isActive: cat.isActive,
    });
    setPreview(cat.image);
    setEditingId(cat._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    await fetch(`http://localhost:5000/api/categories/${id}`, { method: "DELETE" });
    toast.success("🗑️ Category deleted");
    fetchCategories();
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">Categories</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#1daa61] hover:bg-[#18b066] text-white px-5 py-2 rounded-lg shadow-sm"
          >
            <PlusCircle className="w-5 h-5" />
            {showForm ? "Close Form" : "Add Category"}
          </button>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading categories...
          </div>
        ) : (
          <>
            {/* Add/Edit Form */}
            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-sm border space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Category Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="border px-4 py-2 rounded-lg"
                  />
                  <select
                    value={form.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.value === "true" })
                    }
                    className="border px-4 py-2 rounded-lg"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <textarea
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="border px-4 py-2 rounded-lg w-full"
                />

                {/* Image Upload */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full sm:w-auto"
                  />
                  {preview && (
                    <div className="relative inline-block">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="rounded-md border object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#1daa61] hover:bg-[#18b066] text-white px-5 py-2 rounded-lg"
                >
                  {saving && <Loader2 className="animate-spin w-4 h-4" />}
                  {editingId ? "Update Category" : "Save Category"}
                </button>
              </form>
            )}

            {/* Table View */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-500">Image</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Description</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat._id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-12 h-12 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                              No Img
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-800">{cat.name}</td>
                        <td className="px-6 py-3 text-gray-600 truncate max-w-[250px]">
                          {cat.description || "—"}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              cat.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {cat.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-gray-500 py-6 italic"
                      >
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
