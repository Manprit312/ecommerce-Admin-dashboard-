"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;

export default function ContactSettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    address: "",
  });

  // ✅ Fetch existing contact details
  const fetchContactDetails = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contact-settings`);
      const data = await res.json();

      setForm({
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (error) {
      toast.error("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, []);

  // ✅ Update contact settings
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${apiUrl}contact-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Contact details updated!");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DefaultLayout>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Manage Contact Details
      </h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <Loader2 className="animate-spin inline mr-2" /> Loading...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl border shadow space-y-4 max-w-xl"
        >
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-4 py-2 rounded-lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              className="w-full border px-4 py-2 rounded-lg"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Address</label>
            <textarea
              className="w-full border px-4 py-2 rounded-lg"
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#1daa61] hover:bg-[#18b066] px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      )}
    </DefaultLayout>
  );
}
