import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-17" src={assets.logo} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-500">
            CloudKicks is a premium fashion brand that designs and manufactures
            high-quality, durable, and stylish footwear. Our brand is committed
            to providing our customers with the best possible experience, and we
            strive to offer the highest level of customer service and
            satisfaction.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-500">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">CONNECT WITH US</p>
          <ul className="flex flex-col gap-2 text-gray-500">
            <li>+91 93554 26666</li>
            <li>cloudkicks@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="text-center text-sm py-5">
          © 2025 CloudKicks. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
