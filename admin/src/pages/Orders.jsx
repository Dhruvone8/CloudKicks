import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../admin_assets/assets";
import { toast } from "sonner";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/orders/allOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
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
        await fetchAllOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (token) {
        fetchAllOrders();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="w-full text-black">
        <h2 className="text-lg font-semibold mb-6">Order Page</h2>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full text-black">
        <h2 className="text-lg font-semibold mb-6">Order Page</h2>
        <div className="text-center py-16 border border-gray-200 rounded">
          <p className="text-gray-600">No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Order Page</h2>
        <button
          onClick={fetchAllOrders}
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:scale-105 transition-all"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 p-4 md:p-6 
             flex flex-col md:flex-row 
             gap-4 md:gap-6 bg-white rounded-lg"
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
                {order.items.map((item, index) => {
                  if (!item.product) {
                    return (
                      <p key={index} className="text-red-500">
                        Product unavailable × {item.quantity} {item.size}
                      </p>
                    );
                  }
                  return (
                    <p key={index}>
                      {item.product.name} × {item.quantity} {item.size}
                    </p>
                  );
                })}
              </div>

              {/* USER INFO */}
              <div className="pt-2 border-t">
                <p className="font-medium text-gray-900">
                  {order.userId?.name || "Unknown User"}
                </p>
                <p className="text-gray-600">
                  {order.userId?.email || "No email"}
                </p>
              </div>

              {/* ADDRESS */}
              <div className="pt-2">
                <p className="font-medium">Delivery Address:</p>
                <p>{order.address?.street || "N/A"}</p>
                <p>
                  {order.address?.city || ""}, {order.address?.state || ""},{" "}
                  {order.address?.country || ""}, {order.address?.zip || order.address?.zipcode || ""}
                </p>
                <p>{order.address?.phone || "No phone"}</p>
              </div>
            </div>

            {/* ORDER META */}
            <div className="text-sm space-y-1 md:min-w-[160px]">
              <p>
                <span className="font-medium">Items:</span> {order.items.length}
              </p>
              <p>
                <span className="font-medium">Method:</span> {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                <span className={order.isPaid ? "text-green-600" : "text-orange-600"}>
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* PRICE + STATUS */}
            <div
              className="flex flex-row md:flex-col 
                justify-between md:items-end 
                gap-3 md:min-w-[120px]"
            >
              <p className="font-semibold text-lg">₹{order.amount}</p>

              <select
                onChange={(e) => statusHandler(e, order._id)}
                className="border border-gray-300 px-3 py-2 text-sm w-full md:w-auto rounded-md cursor-pointer"
                value={order.status}
                disabled={!order.isPaid}
              >
                {!order.isPaid && (
                  <option value="Pending Payment" disabled>
                    Pending Payment (Payment Required)
                  </option>
                )}
                
                {order.isPaid && (
                  <>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </>
                )}
              </select>
              
              {!order.isPaid && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Awaiting payment confirmation
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;