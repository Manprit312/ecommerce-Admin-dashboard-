"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, RefreshCw, MessageSquare } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;
export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}inquiries`);
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      toast.error(" Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`${apiUrl}inquiries/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success("Status updated");
      fetchInquiries();
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`${apiUrl}inquiries/${id}`, { method: "DELETE" });
    toast.success("🗑️ Deleted");
    fetchInquiries();
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-[#1daa61]" /> Inquiries
          </h1>
          <button
            onClick={fetchInquiries}
            className="flex items-center gap-2 px-4 py-2 bg-[#1daa61] text-white rounded-lg hover:bg-[#189c57] transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading inquiries...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Message</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>

              <tbody>
                {inquiries.length > 0 ? (
                  inquiries.map((inq) => (
                    <motion.tr
                      key={inq._id}
                      className="border-t hover:bg-gray-50 transition"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{inq.name}</td>
                      <td className="px-6 py-4 text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {inq.email}
                      </td>
                      <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={inq.message}>
                        {inq.message}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={inq.status}
                          onChange={(e) => updateStatus(inq._id, e.target.value)}
                          className={`border rounded-lg px-2 py-1 text-sm ${
                            inq.status === "New"
                              ? "border-[#1daa61] text-[#1daa61]"
                              : inq.status === "Read"
                              ? "border-yellow-500 text-yellow-600"
                              : "border-blue-500 text-blue-600"
                          }`}
                        >
                          <option>New</option>
                          <option>Read</option>
                          <option>Replied</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteInquiry(inq._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                      No inquiries found.
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
