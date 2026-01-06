import React from "react";

const Newsletter = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }
    
  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-700">
        Subscribe Now and get 20% Off
      </p>
      <p className="text-gray-400 mt-3">Sign up to receive exclusive offers</p>
      <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-5">
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4 cursor-pointer hover:scale-105 transition-smooth duration-200 ease-in-out"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
