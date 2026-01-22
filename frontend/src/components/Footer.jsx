import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-white">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-17" src={assets.logo} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-700 leading-relaxed">
            CloudKicks is a premium fashion brand that designs and manufactures
            high-quality, durable, and stylish footwear. Our brand is committed
            to providing our customers with the best possible experience, and we
            strive to offer the highest level of customer service and
            satisfaction.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5 text-gray-900">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-700">
            <li className="cursor-pointer hover:text-gray-900">Home</li>
            <li className="cursor-pointer hover:text-gray-900">About Us</li>
            <li className="cursor-pointer hover:text-gray-900">Delivery</li>
            <li className="cursor-pointer hover:text-gray-900">Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5 text-gray-900">CONNECT WITH US</p>
          <ul className="flex flex-col gap-2 text-gray-700">
            <li className="cursor-pointer hover:text-gray-900">+91 93554 26666</li>
            <li className="cursor-pointer hover:text-gray-900">cloudkicks@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr className="border-gray-300" />
        <p className="text-center text-sm py-5 text-gray-700">
          © 2025 CloudKicks. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;