"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Lock, LogOut, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface AdminPayload {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;

const ProfileBox = () => {
  const [admin, setAdmin] = useState<AdminPayload | null>(null);
  const [editing, setEditing] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ✅ Fetch logged-in admin
  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const res = await fetch(`${apiUrl}admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setAdmin(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("adminToken");
      setAdmin(null);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  // ✅ Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Invalid email address";

    if (form.phone && !/^\d{10}$/.test(form.phone))
      errors.phone = "Phone must be 10 digits";

    if (!form.address.trim()) errors.address = "Address is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Save Profile
  const handleSave = async () => {
    if (!admin) return;
    if (!validateForm()) {
      toast.error("Please correct highlighted errors.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}admin/${admin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("✅ Profile updated successfully!");
      setEditing(false);
      fetchAdmin();
    } catch (err) {
      toast.error("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Password validation
  const validatePassword = () => {
    const { newPassword } = passwordData;
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  // ✅ Update Password
  const handlePasswordUpdate = async () => {
    if (!admin) return;
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill both password fields");
      return;
    }
    if (!validatePassword()) return;

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}admin/${admin._id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      if (!res.ok) throw new Error("Failed to change password");

      toast.success("🔒 Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
      setShowPasswordEdit(false);
    } catch (err) {
      toast.error("❌ Incorrect current password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    toast.success("👋 Logged out successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-white/70 to-[#f0fff7]/80 backdrop-blur-lg border border-[#1daa61]/20 p-8 max-w-2xl mx-auto"
    >
      {/* Header with Avatar */}
      <div className="flex flex-col items-center -mt-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-28 h-28 flex items-center justify-center rounded-full bg-[#1daa61] text-white text-5xl font-bold shadow-md"
        >
          {admin?.name ? admin.name[0].toUpperCase() : "A"}
        </motion.div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {admin?.name || "Admin"}
        </h2>
        <p className="text-gray-500">{admin?.email || "Loading..."}</p>
      </div>

      {/* Form Section */}
      {editing ? (
        <div className="mt-8 space-y-3">
          {["name", "email", "phone", "address"].map((field) => (
            <div key={field}>
              <input
                type="text"
                placeholder={`Enter ${field}`}
                value={(form as any)[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#1daa61] focus:outline-none ${
                  validationErrors[field]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors[field] && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors[field]}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#1daa61] hover:bg-[#18b066] text-white px-5 py-2 rounded-lg shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-2 text-center text-gray-700">
          {admin && (
            <>
              <p>📞 {admin.phone || "No phone added"}</p>
              <p>🏠 {admin.address || "No address added"}</p>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {admin && (
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
          )}
          <button
            onClick={() => setShowPasswordEdit(!showPasswordEdit)}
            className="flex items-center gap-2 bg-[#1daa61] text-white px-4 py-2 rounded-lg hover:bg-[#18b066]"
          >
            <Lock className="w-4 h-4" /> Change Password
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}

      {/* Password Change */}
      {showPasswordEdit && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 border-t pt-4"
        >
          <h4 className="text-gray-700 font-semibold mb-3 text-center">
            Change Password
          </h4>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#1daa61]"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#1daa61]"
            />
            <button
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="w-full bg-[#1daa61] hover:bg-[#18b066] text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </motion.div>
      )}

      {/* About Section */}
      <div className="mt-10 text-center text-gray-600 text-sm border-t pt-4">
        <p>
          You are logged in as an <strong>Administrator</strong> with full access
          to the dashboard. Manage products, users, and settings efficiently.
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileBox;
