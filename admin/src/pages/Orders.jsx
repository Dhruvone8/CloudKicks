import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "sonner";
import { assets } from "../admin_assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.get(`${backendUrl}/orders/allOrders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        console.log(response.data.orders);
        setOrders(response.data.orders);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="text-black">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="flex gap-4 p-4 border rounded-md bg-white"
            >
              <img
                src={assets.parcel_icon}
                alt="parcel"
                className="w-12 h-12"
              />

              <div className="flex-1">
                <div className="mb-2">
                  <p className="font-semibold">
                    Customer: {order.userId?.name || "N/A"}
                  </p>
                </div>

                <div className="mb-2">
                  <p className="font-medium">Items:</p>
                  {order.items.map((item, index) => (
                    <p key={index} className="text-sm">
                      {item.product?.name || "Product"} × {item.quantity} (
                      {item.size})
                    </p>
                  ))}
                </div>

                <div className="mb-2">
                  <p className="font-medium">Address:</p>
                  <p className="text-sm">
                    {order.address?.street}, {order.address?.city}
                  </p>
                  <p className="text-sm">
                    {order.address?.country} - {order.address?.zip}
                  </p>
                </div>

                <div className="text-sm">
                  <p>
                    <span className="font-medium">Amount:</span> ₹{order.amount}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {order.status}
                  </p>
                  <p>
                    <span className="font-medium">Payment:</span>{" "}
                    {order.paymentMethod} {order.isPaid ? "✓" : "✗"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-4">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
