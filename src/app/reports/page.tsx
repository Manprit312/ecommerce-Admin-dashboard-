"use client";

import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Users, Package, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
const apiUrl=process.env.NEXT_PUBLIC_API_URL_ADMIN
export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  
const fetchReport = async () => {
  try {
    setLoading(true);

    // Call APIs in parallel to reduce load time
    const [productsRes, customersRes, inquiriesRes] = await Promise.all([
      fetch(`${apiUrl}products`),
      fetch(`${apiUrl}users`),
      fetch(`${apiUrl}inquiries`),
    ]);

    const products = await productsRes.json();
    const customers = await customersRes.json();
    const inquiries = await inquiriesRes.json();

    // Calculate report values from lengths
    const reportData = {
      totalProducts: products.length,
      totalCustomers: customers.length,
      inquiriesReceived: inquiries.length,
      // If needed, other stats here
    };

    setReport(reportData);

  } catch (err) {
    toast.error("Failed to load report");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading)
    return (
      <DefaultLayout>
        <div className="text-center py-20 text-gray-500 animate-pulse">
          Generating Monthly Report...
        </div>
      </DefaultLayout>
    );

  if (!report)
    return (
      <DefaultLayout>
        <div className="text-center py-20 text-gray-500">
          No data available for this month.
        </div>
      </DefaultLayout>
    );

  const chartData = [
    { name: "Products", value: report.totalProducts },
    { name: "Customers", value: report.totalCustomers },
    { name: "Inquiries", value: report.inquiriesReceived },
  ];

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Monthly Report — {report.month}
        </h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* <div className="p-5 bg-white border rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-600 text-sm">Total Inquiries</h2>
              <TrendingUp className="text-[#1daa61]" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              ₹{report.inquiriesReceived.toLocaleString()}
            </p>
          </div> */}

          <div className="p-5 bg-white border rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-600 text-sm">Total Products</h2>
              <Package className="text-[#1daa61]" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {report.totalProducts}
            </p>
          </div>

          <div className="p-5 bg-white border rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-600 text-sm">Total Customers</h2>
              <Users className="text-[#1daa61]" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {report.totalCustomers}
            </p>
          </div>

          <div className="p-5 bg-white border rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-600 text-sm">Inquiries</h2>
              <MessageSquare className="text-[#1daa61]" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {report.inquiriesReceived}
            </p>
          </div>
        </div>

        {/* Orders Breakdown Chart */}
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#1daa61" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DefaultLayout>
  );
}
