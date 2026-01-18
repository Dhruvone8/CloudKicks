import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"GET IN TOUCH"} text2={"WITH US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row items-center justify-center gap-10 mb-28">
        <img
          src={assets.contact_img}
          alt="Contact"
          className="w-full md:max-w-[480px]"
        />

        <div className="flex flex-col gap-6 text-center md:text-left md:items-start">
          <p className="text-xl font-semibold text-gray-600">Our Store</p>

          <p className="text-gray-500 leading-relaxed">
            54790 Willms Street <br />
            Suite 350, Washington, USA
          </p>

          <p className="text-gray-500">Tel: +1 234 567 890</p>
          <p className="text-gray-500">Email: support@cloudkicks.com</p>
          <p className="font-semibold text-lg text-gray-600">
            Careers at CloudKicks
          </p>
          <p className="text-gray-500">Learn more about our openings</p>
          <button className="bg-black text-white px-6 py-2 rounded-full cursor-pointer hover:scale-105 transition-smooth duration-300 ease-in-out">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
