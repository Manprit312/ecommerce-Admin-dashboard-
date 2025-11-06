"use client";
import { useState } from "react";

export default function MonthlyReport() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_ADMIN}orders/monthly-report?month=${month}&year=${year}`
    );

    const data = await res.json();
    setReport(data);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">📊 Monthly Report</h1>

      {/* Month / Year Input */}
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          placeholder="Month (0-11)"
          className="border rounded px-4 py-2"
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year (2025)"
          className="border rounded px-4 py-2"
          onChange={(e) => setYear(e.target.value)}
        />
        <button
          onClick={fetchReport}
          className="px-6 py-2 bg-[#1daa61] text-white rounded-lg"
        >
          Get Report
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Output */}
      {report && (
        <div className="mt-6 p-6 bg-white border rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Month: {Number(report.month) + 1} / {report.year}
          </h2>
          <p>🛒 Total Orders: <strong>{report.totalOrders}</strong></p>
          <p>📦 Items Sold: <strong>{report.totalItemsSold}</strong></p>
          <p>💰 Revenue: <strong>₹{report.totalRevenue}</strong></p>
        </div>
      )}
    </div>
  );
}
