"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const RegisterAdmin: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
        console.log(form)
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://api.nextjs.aydpm.in/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("✅ Admin registered successfully!");
      setTimeout(() => router.push("/auth/signin"), 1500);
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
                Create Admin Account
              </motion.h2>
              <p className="text-gray-600 mb-8">
                Manage your platform securely with admin privileges.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-gray-700 mb-1 text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#1daa61] outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-gray-700 mb-1 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 bg-white/60 focus:ring-2 focus:ring-[#1daa61] outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-gray-700 mb-1 text-sm font-medium">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 bg-white/60 focus:ring-2 focus:ring-[#1daa61] outline-none transition-all"
                    placeholder="Enter password"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-gray-700 mb-1 text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 bg-white/60 focus:ring-2 focus:ring-[#1daa61] outline-none transition-all"
                    placeholder="Confirm password"
                  />
                </motion.div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-md transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#1daa61] hover:bg-[#18b066] hover:shadow-lg"
                  }`}
                >
                  {loading ? "Registering..." : "Register Admin"}
                </motion.button>
              </form>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-gray-600 mt-6 text-center"
              >
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-[#1daa61] font-medium hover:underline">
                  Sign in here
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

export default RegisterAdmin;
