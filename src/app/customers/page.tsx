"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Mail, Trash2, Copy } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/users`);
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
      setFiltered(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(customers);
    } else {
      setFiltered(
        customers.filter(
          (u) =>
            u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, customers]);

  // 🗑️ Delete user
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      toast.loading("Deleting user...");
      const res = await fetch(`${apiUrl}/users/${id}`, {
        method: "DELETE",
      });

      toast.dismiss();

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete user");
      }

      toast.success("✅ User deleted successfully!");
      setCustomers((prev) => prev.filter((u) => u._id !== id));
      setFiltered((prev) => prev.filter((u) => u._id !== id));
    } catch (err: any) {
      toast.error("❌ " + err.message);
    }
  };

  // 📋 Copy email function
  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("📋 Email copied to clipboard");
  };

  // ✂️ Shorten email
  const shortenEmail = (email: string) => {
    if (!email) return "—";
    if (email.length <= 25) return email;
    const [local, domain] = email.split("@");
    const shortLocal = local.length > 12 ? local.slice(0, 12) + "..." : local;
    return `${shortLocal}@${domain}`;
  };

  return (
    <DefaultLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">All Customers</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1daa61] outline-none"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-gray-500">Loading customers...</div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12 text-red-500">
            Failed to load customers: {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Login Count</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Last Login</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Joined</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <Image
                          src={
                            user.photoURL ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={user.displayName || "Customer"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900">
                          {user.displayName || "Unknown User"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-2 max-w-[220px]">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span
                            title={user.email}
                            className="truncate text-sm text-gray-700 flex-1"
                          >
                            {shortenEmail(user.email)}
                          </span>
                          {user.email && (
                            <Copy
                              onClick={() => handleCopy(user.email)}
                              className="w-4 h-4 text-gray-400 hover:text-[#1daa61] cursor-pointer transition flex-shrink-0"
                            />
                          )}
                        </div>
                      </td>


                      <td className="px-6 py-4 text-gray-700">
                        {user.loginCount ?? 1}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800"
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
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
