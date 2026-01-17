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
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token and get user data
  const verifyToken = async (authToken) => {
    try {
      // Decode the JWT token to get user info
      const base64Url = authToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );

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
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful!");

        // Auto-login after registration
        const loginResponse = await axios.post(
          `${backendUrl}/users/login`,
          { email, password },
          { withCredentials: true },
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
              id: userData.id,
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
        },
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
            id: userData.id,
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
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local state even if API call fails
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
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
              id: userData.id,
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

  // Add to cart - Backend integrated
  const addToCart = async (productId, size) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return { success: false, message: "Not authenticated" };
    }

    if (!size) {
      toast.error("Please select a size");
      return { success: false, message: "Size required" };
    }

    try {
      const response = await fetch(`${backendUrl}/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          size,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Added to cart");
        return { success: true };
      } else {
        toast.error(data.message || "Failed to add to cart");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
      return { success: false, message: error.message };
    }
  };

  // Get cart count from backend
  const getCartCount = async () => {
    if (!token) return 0;

    try {
      const response = await fetch(`${backendUrl}/cart/count`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        return data.count || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error getting cart count:", error);
      return 0;
    }
  };

  // Fetch products from backend
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
    addToCart,
    getCartCount,
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