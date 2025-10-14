"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AdminPayload {
  id: string;
  name: string;
  email: string;
  role?: string;
  exp?: number;
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;

const ProfileBox = () => {
  const [admin, setAdmin] = useState<AdminPayload | null>(null);

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const res = await fetch(`${apiUrl}admin/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const admin = await res.json();
      setAdmin(admin);
    } catch (err) {
      console.error("❌ Error fetching admin:", err);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="overflow-hidden rounded-[16px] bg-white shadow-lg dark:bg-gray-dark transition-all duration-500 hover:shadow-2xl"
    >
      {/* Gradient Header */}
      <div
        className="h-40 md:h-56 w-full"
        style={{
          background: "linear-gradient(135deg, #1daa61 0%, #ffffff 100%)",
        }}
      ></div>

      {/* Profile Content */}
      <div className="px-6 pb-8 text-center -mt-20 relative">
        {/* Animated Profile Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-4 w-32 h-32 flex items-center justify-center rounded-full bg-[#1daa61] text-white text-5xl font-bold shadow-lg"
        >
          {admin?.name ? admin.name[0].toUpperCase() : "A"}
        </motion.div>

        {/* Admin Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {admin ? (
            <>
              <h3 className="text-2xl font-semibold text-[#1daa61]">
                {admin.name || "Admin"}
              </h3>
              <p className="text-gray-600 mt-1">{admin.email}</p>
            </>
          ) : (
            <p className="text-gray-500 italic mt-4">
              Not logged in — please sign in to view your profile.
            </p>
          )}
        </motion.div>

   

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto max-w-[600px]"
        >
          <h4 className="font-semibold text-gray-800 mb-2">About Admin</h4>
          <p className="text-gray-600 leading-relaxed">
            {admin
              ? "You are logged in as an admin with full control over the dashboard. Manage users, products, and settings efficiently."
              : "Sign in to see your admin details."}
          </p>
        </motion.div>

        {/* Logout Button */}
        {admin && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            onClick={() => {
              localStorage.removeItem("adminToken");
              setAdmin(null);
            }}
            className="mt-6 inline-flex items-center px-6 py-2.5 bg-[#1daa61] hover:bg-[#b000b0] text-white font-semibold rounded-lg shadow-md transition-all duration-300"
          >
            Logout
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileBox;
