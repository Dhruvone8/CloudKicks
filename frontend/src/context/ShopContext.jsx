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
  const [isLoading, setIsLoading] = useState(true);

  // Verify token and get user data
  const verifyToken = async (authToken) => {
    try {
      // Decode the JWT token to get user info
      const base64Url = authToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decodedToken = JSON.parse(jsonPayload);
      
      // Check if token is expired
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }
      
      return decodedToken;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  };

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
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful!");
        
        // Auto-login after registration
        const loginResponse = await axios.post(
          `${backendUrl}/users/login`,
          { email, password },
          { withCredentials: true }
        );
        
        if (loginResponse.data.success && loginResponse.data.token) {
          const userToken = loginResponse.data.token;
          localStorage.setItem("token", userToken);
          setToken(userToken);
          
          // Verify and set user data
          const userData = await verifyToken(userToken);
          if (userData) {
            setUser({ 
              name, 
              email: userData.email, 
              role: userData.role,
              id: userData.id 
            });
          }
        }
        
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
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const userToken = response.data.token;
        const userRole = response.data.role;
        const userName = response.data.user?.name;
        
        // Check if user is admin - admins should not be allowed to login to frontend
        if (userRole === "admin") {
          toast.error("User doesn't exist with this email/password");
          return { success: false, message: "User not found" };
        }
        
        // Store token
        localStorage.setItem("token", userToken);
        setToken(userToken);
        
        // Verify and set user data
        const userData = await verifyToken(userToken);
        if (userData) {
          setUser({ 
            name: userName,
            email: userData.email, 
            role: userData.role,
            id: userData.id 
          });
          toast.success(response.data.message || "Login successful!");
        }
        
        return { success: true };
      } else {
        toast.error(response.data.message || "Login failed");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
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
      console.error("Logout error:", error);
      // Clear local state even if API call fails
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
      setcartItems({});
      toast.error("Logout failed, but local session cleared");
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const savedToken = localStorage.getItem("token");
      
      if (savedToken) {
        const userData = await verifyToken(savedToken);
        
        if (userData) {
          // Check if token is still valid and user is not admin
          if (userData.role === "admin") {
            // Admin trying to access frontend - clear their session silently
            localStorage.removeItem("token");
            setToken("");
            setUser(null);
          } else {
            setToken(savedToken);
            setUser({
              email: userData.email,
              role: userData.role,
              id: userData.id
            });
          }
        } else {
          // Invalid or expired token
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
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
    isLoading,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;