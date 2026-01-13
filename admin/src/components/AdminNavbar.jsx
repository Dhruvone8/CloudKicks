import React from 'react'
import { assets } from "../admin_assets/assets"

const AdminNavbar = ({setToken}) => {
  return (
    <div className="flex items-center py-1 px-[4%] justify-between">
        <img src={assets.logo} alt="logo" 
        className="w-max[(18%, 84px)] h-15 cursor-pointer" 
        onClick={() => (window.location.href = "/")}
        />
        <button onClick={() => setToken("")}
              className="bg-black text-white py-2 rounded-md text-md my-6 px-6
              cursor-pointer hover:scale-105 transition-all duration-300 w-full sm:w-auto shadow-md"
            >
              Logout
            </button>
    </div>
  )
}

export default AdminNavbar