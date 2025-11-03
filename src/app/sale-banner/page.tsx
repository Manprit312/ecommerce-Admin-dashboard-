"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;

export default function SaleBannerPage() {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch existing banner if available
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${apiUrl}sale-banner`);
        const data = await res.json();
        if (data?.banner?.imageUrl) {
          setUploadedUrl(data.banner.imageUrl);
          setPreview(data.banner.imageUrl);
        }
      } catch (err) {
        console.error("Failed to fetch sale banner:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  // 📤 Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadedUrl(null);
    }
  };

  // 🗑️ Remove selected banner
  const handleRemove = () => {
    setBannerFile(null);
    setPreview(null);
    setUploadedUrl(null);
    setProgress(0);
  };

  // 📦 Handle drag & drop upload
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setBannerFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadedUrl(null);
    }
  };

  // ☁️ Upload to backend
  const handleUpload = async () => {
    if (!bannerFile) {
      toast.error("Please select a sale banner first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", bannerFile);

    try {
      const res = await fetch(`${apiUrl}sale-banner/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      toast.success("Sale banner uploaded successfully!");
      setUploadedUrl(data.banner.imageUrl);
      setProgress(100);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  // 🗑️ Delete current banner
  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}sale-banner`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete banner");
      toast.success("🗑️ Sale banner deleted");
      setUploadedUrl(null);
      setPreview(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96 text-gray-500">
          Loading sale banner...
        </div>
      </DefaultLayout>
    );

  return (
    <DefaultLayout>
      <div className="mx-auto ">
        <div className="backdrop-blur-md border border-gray-100 rounded-3xl p-10 transition-all bg-white shadow-md">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
             Manage Sale Banner
          </h1>

          {/* Drop Zone / Preview */}
          {!preview ? (
            <label
              htmlFor="banner"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center mt-6 cursor-pointer hover:border-[#1daa61] hover:bg-[#f5fff9] transition-all"
            >
              <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">
                Drag & Drop or Click to Upload Sale Banner
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supports PNG, JPG, or SVG (Max 10MB)
              </p>
              <input
                type="file"
                id="banner"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative flex flex-col items-center transition-all duration-300">
              <div className="relative w-72 h-72 group">
                <img
                  src={preview}
                  alt="Sale Banner Preview"
                  className="w-full h-full object-contain rounded-xl border border-gray-200 shadow-sm bg-gray-50 transition-transform group-hover:scale-105"
                />
                <button
                  onClick={handleRemove}
                  title="Remove Banner"
                  className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md opacity-90 hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {uploadedUrl ? (
                <div className="flex items-center gap-2 mt-3 text-green-600 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Uploaded Successfully</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Preview</p>
              )}
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-10">
            <button
              onClick={handleUpload}
              disabled={uploading || !bannerFile}
              className={`w-full py-3 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1daa61] to-[#15b96b] hover:shadow-[0_8px_20px_rgba(29,170,97,0.3)] hover:scale-[1.02]"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Sale Banner"}
            </button>

            {/* Progress Bar */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 overflow-hidden">
                <div
                  className="bg-[#1daa61] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Info Text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Recommended banner ratio: 3:4 (vertical poster).</p>
            <p className="mt-1">Make sure it’s under 10MB for faster load.</p>
          </div>

          {uploadedUrl && (
            <button
              onClick={handleDelete}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition-all"
            >
              Delete Current Banner
            </button>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
