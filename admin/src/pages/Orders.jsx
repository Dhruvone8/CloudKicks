import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../admin_assets/assets";
import { toast } from "sonner";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    const res = await axios.get(`${backendUrl}/orders/allOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setOrders(res.data.orders);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/orders/status`,
        {
          orderId,
          status: event.target.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchAllOrders();
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="w-full text-black">
      <h2 className="text-lg font-semibold mb-6">Order Page</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 p-6 flex gap-6 items-start"
          >
            {/* ICON */}
            <img
              src={assets.parcel_icon}
              alt="parcel"
              className="w-10 h-10 mt-1"
            />

            {/* ITEMS + ADDRESS */}
            <div className="flex-1 space-y-2 text-sm">
              {/* ITEMS */}
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.product?.name} × {item.quantity} {item.size}
                  </p>
                ))}
              </div>

              {/* SHOP / ADDRESS */}
              <div className="pt-2">
                <p className="font-medium">Great Stack</p>
                <p>Main Street,</p>
                <p>
                  {order.address?.city}, {order.address?.state},{" "}
                  {order.address?.country}, {order.address?.zip}
                </p>
                <p>{order.address?.phone}</p>
              </div>
            </div>

            {/* ORDER META */}
            <div className="text-sm space-y-1 min-w-[160px]">
              <p>Items : {order.items.length}</p>
              <p>Method : {order.paymentMethod}</p>
              <p>Payment : {order.isPaid ? "Paid" : "Pending"}</p>
              <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            {/* PRICE + STATUS */}
            <div className="flex flex-col items-end gap-3 min-w-[120px]">
              <p className="font-semibold">${order.amount}</p>

              <select
                onChange={(e) => statusHandler(e, order._id)}
                className="border border-gray-300 px-3 py-1 text-sm"
                value={order.status}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Item Packed">Item Packed</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;