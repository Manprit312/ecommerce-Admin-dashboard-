"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, Edit, X, Loader2 } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    product: "",
    tag: "",
    image: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 🔹 Fetch sliders
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/sliders");
      const data = await res.json();
      setSliders(data);
    } catch (err) {
      toast.error("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // 🔹 Handle image preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileData = e.target.files?.[0];
    setFile(fileData || null);

    if (fileData) {
      const previewUrl = URL.createObjectURL(fileData);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  };

  const removePreview = () => {
    setFile(null);
    setPreview(null);
  };

  // 🔹 Submit handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Please enter a title");
    if (!form.subtitle.trim()) return toast.error("Please enter a subtitle");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v as string));
    if (file) formData.append("image", file);

    try {
      setLoading(true);

      const res = await fetch(
        editingId
          ? `http://localhost:5000/api/sliders/${editingId}`
          : "http://localhost:5000/api/sliders",
        {
          method: editingId ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to save slider");

      toast.success(editingId ? "✅ Slider updated" : "✅ Slider created");
      setForm({
        title: "",
        subtitle: "",
        description: "",
        product: "",
        tag: "",
        image: "",
      });
      setFile(null);
      setPreview(null);
      setEditingId(null);
      fetchSliders();
    } catch (err: any) {
      toast.error("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Edit existing
  const handleEdit = (s: any) => {
    setForm({
      title: s.title,
      subtitle: s.subtitle,
      description: s.description,
      product: s.product,
      tag: s.tag,
      image: s.image,
    });
    setPreview(s.image);
    setEditingId(s._id);
  };

  // 🔹 Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slider?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/sliders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("🗑️ Deleted");
      setSliders((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold">Manage Sliders</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm border space-y-4 relative"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
              <Loader2 className="w-8 h-8 text-[#1daa61] animate-spin" />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Subtitle"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="border px-4 py-2 rounded-lg"
            />
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border px-4 py-2 rounded-lg"
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border px-4 py-2 rounded-lg w-full"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Product Name"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className="border px-4 py-2 rounded-lg"
            />
            <input
              placeholder="Tagline (e.g. Best Seller)"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="border px-4 py-2 rounded-lg"
            />
          </div>

          {/* Image Upload & Preview */}
          <div className="space-y-3">
            {!preview ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded-lg px-4 py-2 cursor-pointer"
              />
            ) : (
              <div className="relative w-64 h-40 border rounded-lg overflow-hidden group">
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={removePreview}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#1daa61] hover:bg-[#18b066] text-white px-5 py-2 rounded-lg"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <PlusCircle className="w-5 h-5" />
            )}
            {editingId ? "Update Slide" : "Add Slide"}
          </button>
        </form>

        {/* Slider List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-[#1daa61] animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {sliders.map((s) => (
              <div
                key={s._id}
                className="border rounded-xl p-4 bg-white shadow-sm relative hover:shadow-md transition"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="rounded-md mb-3 w-full h-48 object-cover"
                />
                <h2 className="font-semibold text-gray-800">{s.title}</h2>
                <p className="text-sm text-gray-500">{s.subtitle}</p>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    disabled={deletingId === s._id}
                    className="text-red-500 hover:text-red-700"
                  >
                    {deletingId === s._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
