import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/admin/login", {email, password})

    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-400 mb-2">
              Email Address
            </p>
            <input
              className="rounded-md w-full px-3 py-2 border border-gray-3000 outline-none"
              type="email"
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-400 mb-2">Password</p>
            <input
              className="rounded-md w-full px-3 py-2 border border-gray-3000 outline-none"
              type="password"
              placeholder="*******"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button
            className="bg-black text-white py-2 rounded-md text-md my-6 px-6
              cursor-pointer hover:scale-105 transition-all duration-300 w-full sm:w-auto shadow-md"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
