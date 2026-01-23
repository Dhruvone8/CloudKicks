import React from "react";
import { assets } from "../admin_assets/assets";

const AdminNavbar = ({ setToken }) => {
  return (
    <div className="flex items-center justify-between
                    py-2 px-4 sm:px-[4%]
                    border-b bg-white">

      {/* LOGO */}
      <img
        src={assets.logo}
        alt="logo"
        className="h-12 w-auto cursor-pointer"
        onClick={() => (window.location.href = "/")}
      />

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => setToken("")}
        className="bg-black text-white
                   px-5 py-2
                   rounded-md text-sm
                   hover:scale-105
                   transition-all duration-300
                   shadow-md"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
