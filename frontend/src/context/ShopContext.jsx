import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const deliveryFee = 7;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setcartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(
        `${backendUrl}/users/register`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true, // Important for cookies
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful!");
        // Store the user info
        setUser({ name, email });
        navigate("/");
        return { success: true };
      } else {
        toast.error(response.data.message || "Registration failed");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || 
        error.message || 
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${backendUrl}/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Important for cookies
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
        }
        // You might want to fetch user data here
        setUser({ email, role: response.data.role });
        navigate("/");
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get(`${backendUrl}/users/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
      setcartItems({});
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      // Optionally verify token with backend
    }
  }, []);

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
  };

  const getCartTotal = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            totalAmount += itemInfo.price * cartItems[items][size];
          }
        }
      }
    }
    return totalAmount;
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/products/list`);
      if (response.data.success) {
        const transformedProducts = response.data.products.map((product) => ({
          ...product,
          image: product.images.map((img) => img.url),
        }));
        setProducts(transformedProducts);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    updateQuantity,
    getCartTotal,
    navigate,
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    register,
    login,
    logout,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;