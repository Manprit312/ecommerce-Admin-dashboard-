"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, UploadCloud, CheckCircle2, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;

export default function LogoUploadPage() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  // ✅ Fetch existing logo from backend
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch(`${apiUrl}logo`);
        if (!res.ok) throw new Error("Failed to fetch logo");
        const data = await res.json();

        if (data?.logoUrl) {
          setPreview(data.logoUrl);
          setUploadedUrl(data.logoUrl);
        }
        if (data?.description) setDescription(data.description); // ✅ load description
      } catch (err) {
        console.error("Failed to fetch logo:", err);
      }
    };

    fetchLogo();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadedUrl(null);
    }
  };

  const handleRemove = async () => {
    if (uploadedUrl && !logoFile) {
      try {
        const res = await fetch(`${apiUrl}logo/delete`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Logo removed successfully");
        } else {
          toast.error("Failed to delete logo");
        }
      } catch (err) {
        toast.error("Error deleting logo");
      }
    }
    setLogoFile(null);
    setPreview(null);
    setUploadedUrl(null);
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!logoFile && description.trim() === "") {
      toast.error("No update to perform.");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    if (logoFile) formData.append("file", logoFile);  // ✅ only if new file
    formData.append("description", description);       // ✅ always send description

    try {
      const res = await fetch(`${apiUrl}logo/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      toast.success("Logo updated!");
      setUploadedUrl(data.logoUrl);
      setPreview(data.logoUrl);
      setProgress(100);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto">
        <div className="backdrop-blur-md border border-gray-100 rounded-3xl p-10 transition-all">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Upload Website Logo
          </h1>

          {/* Drop Zone / Preview */}
          {!preview ? (
            <label
              htmlFor="logo"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-15 text-center mt-15 cursor-pointer hover:border-[#1daa61] hover:bg-[#f5fff9] transition-all"
            >
              <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">
                Drag & Drop or Click to Upload Logo
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supports PNG, JPG, or SVG (Max 10MB)
              </p>
              <input
                type="file"
                id="logo"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative flex flex-col items-center transition-all duration-300">
              <div className="relative w-44 h-44 group">
                <img
                  src={preview}
                  alt="Logo Preview"
                  className="w-full h-full object-contain rounded-xl border border-gray-200 shadow-sm bg-gray-50 transition-transform group-hover:scale-105"
                />
                <button
                  onClick={handleRemove}
                  title="Remove Logo"
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

              {uploadedUrl && (
                <button
                  onClick={() => {
                    window.open(uploadedUrl, "_blank");
                  }}
                  className="mt-3 flex items-center text-[#1daa61] text-sm hover:underline gap-1"
                >
                  <RefreshCcw className="w-4 h-4" />
                  View current logo
                </button>
              )}
            </div>
          )}
          <div className="mt-6">
            <label className="text-gray-700 font-medium">Footer Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter footer tagline / description..."
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1daa61] outline-none"
              rows={3}
            />
          </div>
          {/* Upload Button */}
          <div className="mt-10">
            <button
              onClick={handleUpload}
              disabled={uploading || (!logoFile && description.trim() === "")}

              className={`w-full py-3 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all ${uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1daa61] to-[#15b96b] hover:shadow-[0_8px_20px_rgba(29,170,97,0.3)] hover:scale-[1.02]"
                }`}
            >
              {uploading ? "Updating..." : "Update Logo & Description"}
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
            <p>
              Make sure your logo has a transparent background for best
              appearance.
            </p>
            <p className="mt-1">Maximum size: 10MB</p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
