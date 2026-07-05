"use client";

import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch orders from backend API
    const fetchOrders = async () => {
      const res = await fetch("/api/orders"); // Adjust API route
      const data = await res.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    // Refresh orders after
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Order ID</th>
            <th className="border p-2 text-left">User ID</th>
            <th className="border p-2 text-left">Total</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.userId}</td>
              <td className="border p-2">${order.total.toFixed(2)}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="border p-2">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;