"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ClickOutside from "@/components/ClickOutside";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

interface Admin {
  name: string;
  email: string;
}

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const router = useRouter();

  // ✅ Fetch admin data
  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const res = await fetch("https://api.nextjs.aydpm.in/api/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setAdmin(data);
    } catch (err) {
      console.error("Error fetching admin:", err);
      localStorage.removeItem("adminToken");
      router.push("/signin");
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setDropdownOpen(false);
    router.push("/auth/signin");
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      {/* Button Trigger */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 focus:outline-none"
      >
        {/* Avatar Circle */}
        <div
          className="h-11 w-11 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-md"
          style={{
            background: "linear-gradient(135deg, #1daa61, #7be495)",
          }}
        >
          {admin?.name ? admin.name[0].toUpperCase() : "A"}
        </div>

        {/* Name + Chevron */}
        <span className="flex items-center gap-1 font-medium text-dark dark:text-gray-200">
          <span className="hidden lg:block">{admin?.name || "Admin"}</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-4 w-[270px] rounded-xl border border-gray-100 bg-white shadow-xl dark:bg-gray-800 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="flex items-center gap-3  border-b border-gray-100 dark:border-gray-700">
              <div
                style={{
                  background: "linear-gradient(135deg, #1daa61, #7be495)",
                }}
              >
                {admin?.name ? admin.name[0].toUpperCase() : "A"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {admin?.name || "Admin"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {admin?.email.substring(0,18)+"..." || "admin@example.com"}
                </p>
              </div>
            </div>

            {/* Links */}
            <ul className="flex flex-col gap-1 p-2.5">
              <li>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-[#e9f8f1] hover:text-[#1daa61] dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-[#7be495] transition-all"
                >
                  <User size={16} />
                  View Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-[#e9f8f1] hover:text-[#1daa61] dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-[#7be495] transition-all"
                >
                  <Settings size={16} />
                  Account Settings
                </Link>
              </li>
            </ul>

            {/* Logout */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-2.5">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#1daa61] hover:bg-[#e9f8f1] dark:hover:bg-gray-700 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ClickOutside>
  );
};

export default DropdownUser;
