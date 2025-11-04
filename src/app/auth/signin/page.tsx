"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;
const SignInAdmin: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("Login successful!");
      localStorage.setItem("adminToken", data.token);
      setTimeout(() => router.push("/reports"), 1500);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#A8E6CF] to-white p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-white/80 backdrop-blur-md shadow-xl border border-white/30 overflow-hidden max-w-5xl w-full"
        >
          <div className="flex flex-col xl:flex-row items-stretch">
            {/* Left Form Section */}
            <div className="w-full xl:w-1/2 flex flex-col justify-center p-8 sm:p-14">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-[#1daa61] mb-2"
              >
                Welcome Back, Admin
              </motion.h2>
              <p className="text-gray-600 mb-8">
                Sign in to manage your platform securely.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-gray-700 mb-1 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#1daa61] outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                 <label className="block text-gray-700 mb-1 text-sm font-medium">
  Password
</label>

<div className="relative">
  <input
    name="password"
    type={showPassword ? "text" : "password"}
    value={form.password}
    onChange={handleChange}
    className="w-full border rounded-xl px-4 py-3 bg-white/60 focus:ring-2 focus:ring-[#1daa61] outline-none transition-all pr-11"
    placeholder="Enter password"
  />

  {/* 👁️ Eye toggle button */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1daa61] transition-all flex items-center justify-center"
  >
    {showPassword ? (
      // 👁️ Eye open icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ) : (
      // 🙈 Eye off icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3l18 18M10.73 5.08A9.957 9.957 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.21 4.882M6.219 6.219A9.956 9.956 0 002.458 12c1.274 4.057 5.064 7 9.542 7 1.364 0 2.676-.27 3.869-.76M9.88 9.88A3 3 0 0114.12 14.12"
        />
      </svg>
    )}
  </button>
</div>


                </motion.div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-md transition-all duration-300 ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#1daa61] hover:bg-[#18b066] hover:shadow-lg"
                    }`}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </motion.button>
              </form>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-gray-600 mt-6 text-center"
              >
                Don’t have an account?{" "}
                <Link href="/auth/register" className="text-[#1daa61] font-medium hover:underline">
                  Register here
                </Link>
              </motion.p>
            </div>

            {/* Right Illustration Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden xl:flex w-full xl:w-1/2 bg-gradient-to-b from-[#1daa61] to-[#A8E6CF] items-center justify-center relative overflow-hidden"
            >
              <div className="text-center text-white p-10">
                <div>
                  <div className="flex items-center justify-center rounded-full bg-[#1daa61]/20">
                    <span className="text-[#1daa61] font-bold text-xl">A</span>
                  </div>

                  {/* Company Name */}
                  <span className="text-white font-semibold text-3xl leading-tight">
                    Arya <span className="text-gray-800 font-semibold">Enterprises</span>
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-3 mt-2 drop-shadow-lg">Hello Again!</h1>
                <p className="max-w-sm mx-auto text-white/90 font-medium leading-relaxed">
                  Access your admin dashboard and manage everything with ease and control.
                </p>
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Illustration"
                  width={400}
                  height={300}
                  className="mx-auto mt-8 opacity-90"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignInAdmin;
