import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "sonner";

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders from backend
  const loadOrderData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return null;
      }

      const response = await fetch(`${backendUrl}/orders/userOrders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: sends cookies with request
      });

      const data = await response.json();

      if (data.success) {
        let allOrdersItems = [];

        data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItems.push({
              ...item,
              status: order.status,
              paymentMethod: order.paymentMethod,
              isPaid: order.isPaid,
              orderDate: order.createdAt,
              orderId: order._id,
              address: order.address,
              amount: order.amount,
            });
          });
        });

        setOrderData(allOrdersItems.reverse()); // Show newest first
      } else {
        toast.error(data.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-500";
      case "Processing":
        return "bg-yellow-500";
      case "Shipped":
        return "bg-purple-500";
      case "Delivered":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="border-t pt-16">
        <div className="text-2xl mb-8">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // No orders state
  if (!token) {
    return (
      <div className="border-t pt-16">
        <div className="text-2xl mb-8">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            Please login to view your orders
          </p>
        </div>
      </div>
    );
  }

  if (orderData.length === 0) {
    return (
      <div className="border-t pt-16">
        <div className="text-2xl mb-8">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            You haven't placed any orders yet
          </p>
          <a
            href="/collection"
            className="inline-block mt-4 bg-black text-white px-8 py-3 rounded-md hover:scale-105 transition-all duration-300"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.map((item, index) => {
          return (
            <div
              key={index}
              className="py-4 border-b text-gray-700 flex flex-col 
                md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  src={item.product?.images?.[0]?.url || "/placeholder.png"}
                  alt={item.product?.name || "Product"}
                  className="w-16 sm:w-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-base">
                    {item.product?.name || "Product"}
                  </p>
                  <div className="text-gray-700 flex items-center gap-3 mt-2 text-base">
                    <p className="text-lg">
                      {currency} {item.price}
                    </p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                    <p className="text-sm">Size: {item.size}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Order Date: {formatDate(item.orderDate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment: {item.paymentMethod}
                    {item.isPaid ? " ✓ Paid" : " - Pending"}
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${getStatusColor(
                      item.status,
                    )}`}
                  ></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={() => loadOrderData()} // Refresh to check status
                  className="bg-black text-white py-2 px-5 rounded-md text-sm
                    cursor-pointer hover:scale-105 transition-all duration-300 
                    w-36 sm:w-auto shadow-md"
                >
                  Track Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
