import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import Title from "../components/Title";
import TextField from "@mui/material/TextField";
import DeleteButton from "../components/ui/delete-button";
import { toast } from "sonner";
import CartTotal from "../components/CartTotal";
import AuthDialog from "../components/ui/authDialog";

const Cart = () => {
  const { currency, navigate, backendUrl, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  // Check if auth dialog should be open based on URL
  const authDialogOpen = searchParams.get("auth") === "true";

  const setAuthDialogOpen = (open) => {
    if (open) {
      setSearchParams({ auth: "true" });
    } else {
      setSearchParams({});
    }
  };

  // Fetch cart data from backend
  const fetchCartData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/cart`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setCartData(data.cartData);
      } else {
        toast.error("Failed to load cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, size, newQuantity) => {
    const updateKey = `${productId}-${size}`;
    setUpdating((prev) => ({ ...prev, [updateKey]: true }));

    try {
      const response = await fetch(`${backendUrl}/cart/update`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          size,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCartData(data.cartData);
        if (newQuantity === 0) {
          toast.success("Item removed from cart");
        }
      } else {
        toast.error(data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdating((prev) => ({ ...prev, [updateKey]: false }));
    }
  };

  // Calculate cart total for CartTotal component
  const getCartTotal = () => {
    return cartData.reduce((total, item) => {
      if (item.product) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    fetchCartData();
  }, [token]);

  // Show login prompt if not authenticated
  if (!token) {
    return (
      <>
        <div className="border-t pt-14 min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Please login to view your cart</p>
            <button
              onClick={() => setAuthDialogOpen(true)}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      </>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="border-t pt-14 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message
  if (cartData.length === 0) {
    return (
      <div className="border-t pt-14 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add some products to get started
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="flex flex-col gap-y-3">
        {cartData.map((item) => {
          if (!item.product) return null;

          const productData = item.product;
          const uniqueId = `${item.product._id}-${item.size || "no-size"}`;
          const isUpdating = updating[uniqueId];

          const imageUrl =
            productData.images?.[0]?.url || productData.images?.[0];

          return (
            <div
              key={uniqueId}
              className="py-4 border-t border-b text-gray-700 grid 
              grid-cols-2 sm:grid-cols-[4fr_1fr_0.5fr] 
              items-center gap-4"
            >
              <div className="col-span-2 sm:col-span-1 flex items-start gap-4">
                <img
                  src={imageUrl}
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
                    {item.size && (
                      <p className="px-2 py-1 border bg-slate-50 rounded-md text-xs text-gray-600">
                        {item.size}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-start sm:justify-center">
                <TextField
                  type="number"
                  label="Qty"
                  size="small"
                  inputProps={{ min: 1, max: 10 }}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.product._id,
                      item.size,
                      Number(e.target.value)
                    )
                  }
                  disabled={isUpdating}
                  sx={{
                    width: "80px",
                    "& .MuiInputBase-root": { backgroundColor: "white" },
                  }}
                />
              </div>

              <div className="flex justify-end sm:justify-center">
                <DeleteButton
                  id={uniqueId}
                  onConfirm={() => {
                    updateQuantity(item.product._id, item.size, 0);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-10 sm:my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal cartTotal={getCartTotal()} />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/checkout")}
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