import { createContext, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "sonner";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const deliveryFee = 7;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setcartItems] = useState({});

  const addToCart = (itemId, size) => {
    return new Promise((resolve, reject) => {
      if (!size) {
        reject("Please select a size");
        return;
      }

      let cartData = structuredClone(cartItems);

      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }

      setcartItems(cartData);

      setTimeout(() => {
        resolve("Added to cart");
      }, 500);
    });
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setcartItems(cartData);
  }

  const value = {
    products,
    currency,
    deliveryFee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setcartItems,
    addToCart,
    getCartCount,
    updateQuantity
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
