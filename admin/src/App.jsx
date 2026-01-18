import React, { useState, useEffect } from "react";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import { Routes, Route } from "react-router-dom";
import AddProducts from "./pages/AddProducts";
import ListProducts from "./pages/ListProducts";
import Orders from "./pages/Orders";
import AdminLogin from "./components/AdminLogin";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { Toaster } from "sonner";
export const currency = "₹";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster richColors position="top-right" />
      {token === "" ? (
        <AdminLogin setToken={setToken} />
      ) : (
        <>
          <AdminNavbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <AdminSidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<AddProducts token={token} />} />
                <Route path="/list" element={<ListProducts token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
