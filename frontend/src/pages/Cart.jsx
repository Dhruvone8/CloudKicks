import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import TextField from "@mui/material/TextField";
import DeleteButton from "../components/delete-button";
import { toast } from "sonner";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="flex flex-col gap-y-3">
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          if (!productData) return null;

          const uniqueId = `${item._id}-${item.size}`;

          return (
            <div
              key={uniqueId}
              // --- LAYOUT FIX ---
              // Mobile: grid-cols-2 (Creates 2 rows automatically)
              // Desktop: grid-cols-[4fr_1fr_0.5fr] (Keeps everything in 1 row)
              className="py-4 border-t border-b text-gray-700 grid 
              grid-cols-2 sm:grid-cols-[4fr_1fr_0.5fr] 
              items-center gap-4"
            >
              {/* 1. Product Info: Spans 2 cols on mobile (full width), 1 col on desktop */}
              <div className="col-span-2 sm:col-span-1 flex items-start gap-4">
                <img
                  src={productData.image[0]}
                  alt={productData.name}
                  className="w-20 sm:w-20 object-cover aspect-square rounded-sm"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-sm sm:text-lg font-medium text-gray-800">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-base text-gray-600 font-semibold">
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 py-1 border bg-slate-50 rounded-md text-xs text-gray-600">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Quantity Input */}
              {/* Mobile: Standard grid cell. Desktop: Center aligned */}
              <div className="flex justify-start sm:justify-center">
                <TextField
                  type="number"
                  label="Qty"
                  size="small"
                  inputProps={{ min: 1, max: 10 }}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item._id, item.size, Number(e.target.value))
                  }
                  sx={{ 
                    width: "80px",
                    // Fix styling to ensure label doesn't overlap text
                    "& .MuiInputBase-root": { backgroundColor: "white" }
                  }}
                />
              </div>

              {/* 3. Delete Button */}
              {/* Mobile: Aligns right. Desktop: Center/End aligned */}
              <div className="flex justify-end sm:justify-center">
                <DeleteButton
                  id={uniqueId}
                  onConfirm={() => {
                    updateQuantity(item._id, item.size, 0);
                    toast.success("Item removed from cart");
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-10 sm:my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-black text-white py-3 rounded-md text-md my-8 px-8
              cursor-pointer hover:scale-105 transition-all duration-300 w-full sm:w-auto shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;