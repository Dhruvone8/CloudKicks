import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "sonner";
import { assets } from "../admin_assets/assets";
import { User } from "lucide-react";

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
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex gap-4 p-4 border rounded-md bg-white"
          >
            <img src={assets.parcel_icon} alt="parcel" className="w-12 h-12" />

            <div>
              {order.items.map((item, index) => (
                <p key={index} className="text-sm">
                  {item.product.name} × {item.quantity}{" "}
                  <span className="text-gray-500">({item.size})</span>
                </p>
              ))}
            </div>
            <p>{order.firstName + " " + order.lastName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
