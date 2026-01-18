import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;
    } catch (err) {}
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
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
                  src={item.image[0]}
                  alt={item.name}
                  className="w-16 sm:w-20"
                />
                <div>
                  <p className="font-medium text-base">{item.name}</p>
                  <div className="text-gray-700 flex items-center gap-3 mt-2 text-base ">
                    <p className="text-lg">
                      {currency} {item.price}
                    </p>
                    <p className="text-sm">Qty: 1</p>
                    <p className="text-sm">Size: M</p>
                  </div>
                  <p className="text-sm text-gray-500 pt-2">
                    Order Date: 1 January, 2026
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">Ready To Ship</p>
                </div>
                <button
                  className="bg-black text-white py-1.75 rounded-md text-md my-5 px-5
              cursor-pointer hover:scale-105 transition-all duration-300 w-40 sm:w-auto shadow-md"
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
