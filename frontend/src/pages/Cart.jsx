import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import TextField from "@mui/material/TextField";
import DeleteButton from "../components/delete-button";
import { toast } from "sonner";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } =
    useContext(ShopContext);

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

      {cartData.map((item) => {
        const productData = products.find(
          (product) => product._id === item._id
        );

        if (!productData) return null;

        const uniqueId = `${item._id}-${item.size}`;

        return (
          <div
            key={uniqueId}
            className="py-4 border-t border-b text-gray-700 grid 
            grid-cols-[4fr_100px_180px] 
            sm:grid-cols-[4fr_120px_200px] 
            items-center gap-4"
          >
            {/* Product Info */}
            <div className="flex items-start gap-6">
              <img
                src={productData.image[0]}
                alt={productData.name}
                className="w-16 sm:w-20"
              />
              <div>
                <p className="text-xs sm:text-lg font-medium">
                  {productData.name}
                </p>
                <div className="flex items-center gap-5 mt-2">
                  <p className="text-lg text-gray-600">
                    {currency}
                    {productData.price}
                  </p>
                  <p className="px-2 sm:px-3 sm:py-1 border bg-slate-100 rounded-md text-sm text-gray-600">
                    {item.size}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex justify-center">
              <TextField
                type="number"
                label="Qty"
                size="small"
                inputProps={{ min: 1, max: 10 }}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item._id, item.size, Number(e.target.value))
                }
                sx={{ width: "80px" }}
              />
            </div>

            {/* Delete Button */}
            <div className="flex justify-center">
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
  );
};

export default Cart;
