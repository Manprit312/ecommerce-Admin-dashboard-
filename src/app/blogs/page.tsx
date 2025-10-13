"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { PlusCircle, Edit, Trash2, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Image from "next/image";

// ✅ React Quill (text editor)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    status: "Draft",
    author: "Admin",
  });

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/blogs`);
      const data = await res.json();
      setBlogs(data);
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
    Object.entries(form).forEach(([k, v]) => formData.append(k, v as string));
    if (form.tags) formData.set("tags", JSON.stringify(form.tags.split(",")));
    if (file) formData.append("image", file);

    try {
      const res = await fetch(
        editingId
          ? `${apiUrl}/blogs/${editingId}`
          : `${apiUrl}/blogs`,
        {
          method: editingId ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to save blog");

      toast.success(editingId ? "Blog updated!" : " Blog created!");
      resetForm();
      fetchBlogs();
    } catch (err: any) {
      toast.error("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      tags: "",
      status: "Draft",
      author: "Admin",
    });
    setFile(null);
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (b: any) => {
    setForm({
      title: b.title,
      content: b.content,
      tags: b.tags.join(", "),
      status: b.status,
      author: b.author,
    });
    setEditingId(b._id);
    setShowForm(true);
    setPreview(b.image);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    setLoading(true);
    await fetch(`http://localhost:5000/api/blogs/${id}`, { method: "DELETE" });
    toast.success("🗑️ Blog deleted");
    fetchBlogs();
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">Blogs</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#1daa61] hover:bg-[#18b066] text-white px-5 py-2 rounded-lg shadow-sm"
          >
            <PlusCircle className="w-5 h-5" />
            {showForm ? "Close Form" : "Add Blog"}
          </button>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading blogs...
          </div>
        ) : (
          <>
            {/* Form (only when active) */}
            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-sm border space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Blog Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border px-4 py-2 rounded-lg"
                    required
                  />
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="border px-4 py-2 rounded-lg"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(value) => setForm({ ...form, content: value })}
                  className="bg-white rounded-lg border border-gray-200"
                  placeholder="Write your blog content here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                />

                <input
                  placeholder="Tags (comma separated)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
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
                  {editingId ? "Update Blog" : "Save Blog"}
                </button>
              </form>
            )}

            {/* Blogs Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-500">Image</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Title</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Author</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Created</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length > 0 ? (
                    blogs.map((b) => (
                      <tr key={b._id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <img
                            src={b.image}
                            alt={b.title}
                            className="w-12 h-12 object-cover rounded-md border"
                          />
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-800">{b.title}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              b.status === "Published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-700">{b.author}</td>
                        <td className="px-6 py-3 text-gray-500">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-6 text-right flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(b)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
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
                        colSpan={6}
                        className="text-center text-gray-500 py-6 italic"
                      >
                        No blogs found.
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
