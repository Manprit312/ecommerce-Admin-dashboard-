"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, Package, RefreshCw,Download } from "lucide-react";
import toast from "react-hot-toast";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (order: any) => {
  const doc = new jsPDF();

const mint: [number, number, number] = [29, 170, 97];
  // 🧾 Header Background
  doc.setFillColor(...mint);
  doc.rect(0, 0, 210, 30, "F"); // full-width top bar
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("INVOICE", 14, 20);

  // 🧍 Customer Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("Customer Details", 14, 40);
  doc.setDrawColor(...mint);
  doc.line(14, 42, 196, 42);

  doc.setFontSize(10);
  doc.text(`Customer: ${order.customerName}`, 14, 50);
  doc.text(`Email: ${order.email}`, 14, 56);
  doc.text(`Phone: ${order.phone}`, 14, 62);
  doc.text(`Address: ${order.address}, ${order.city} - ${order.pincode}`, 14, 68);

  // 💳 Payment Info
  doc.text("Payment Details", 14, 82);
  doc.line(14, 84, 196, 84);
  doc.text(`Payment Method: ${order.paymentMethod}`, 14, 92);
  doc.text(`Payment Status: ${order.paymentStatus}`, 14, 98);
  doc.text(`Order Status: ${order.status}`, 14, 104);

  // 📦 Items Table
  const tableData = order.items.map((item: any) => [
    item.name,
    item.quantity,
    `Rs.${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    `Rs.${(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
  ]);

  autoTable(doc, {
    startY: 115,
    head: [["Item", "Qty", "Price", "Total"]],
    body: tableData,
    styles: {
      fontSize: 10,
      textColor: [50, 50, 50],
      lineColor: [200, 200, 200],
    },
    headStyles: {
      fillColor: mint,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  });

  // 💰 Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(...mint);
  doc.text(`Subtotal:Rs.${order.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 14, finalY);
  doc.text(`Total:Rs.${order.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 14, finalY + 8);

  // 📅 Footer
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY + 20);
  doc.text("Thank you for shopping with us 💚", 14, finalY + 27);

  // 💾 Save
  doc.save(`Invoice_${order._id}.pdf`);
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL_ADMIN;
export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      toast.error("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`${apiUrl}orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      toast.success("✅ Order status updated");
      fetchOrders();
    } catch (err: any) {
      toast.error("❌ " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order?")) return;

    try {
      const res = await fetch(`${apiUrl}orders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete order");
      toast.success("🗑️ Order deleted");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err: any) {
      toast.error("❌ " + err.message);
    }
  };

  return (
    <DefaultLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
            <Package className="text-[#1daa61]" /> Orders
          </h1>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-[#1daa61] text-white rounded-lg hover:bg-[#179f55] transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{order.email}</td>
                      <td className="px-6 py-4 text-[#1daa61] font-semibold">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "Failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          disabled={updating}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#1daa61]"
                        >
                          {["Processing", "Shipped", "Delivered", "Cancelled"].map(
                            (status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="text-red-500 hover:text-red-700"
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
                      className="text-center text-gray-500 py-6 italic"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🧾 Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-2xl relative"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Order Details
              </h2>

              <div className="border-b pb-3 mb-3 text-sm text-gray-600">
                <p>
                  <strong>Customer:</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedOrder.phone}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {`${selectedOrder.address}, ${selectedOrder.city}, ${selectedOrder.pincode}`}
                </p>
                <p>
                  <strong>Payment:</strong> {selectedOrder.paymentMethod} (
                  {selectedOrder.paymentStatus})
                </p>
              </div>

              <h3 className="font-semibold mb-2 text-gray-700">Items:</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {selectedOrder.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-[#1daa61]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

             <div className="mt-4 flex justify-between items-center border-t pt-3">
  <div>
    <p className="text-gray-700">
      <strong>Subtotal:</strong> ₹{selectedOrder.subtotal.toFixed(2)}
    </p>
    <p className="text-gray-700">
      <strong>Total:</strong>{" "}
      <span className="text-[#1daa61] font-semibold">
        ₹{selectedOrder.totalAmount.toFixed(2)}
      </span>
    </p>
  </div>

<button
  onClick={() => generateInvoice(selectedOrder)}
  className="flex items-center gap-2 px-4 py-2 bg-[#1daa61] text-white rounded-lg hover:bg-[#179f55] transition"
>
  <Download className="w-4 h-4" />
  Download Invoice
</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DefaultLayout>
  );
}
