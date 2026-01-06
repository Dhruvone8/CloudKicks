import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t`">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt="about_img"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p className="text-gray-600">
            CloudKicks was born out of passion for innovation and desire to
            produce quality footwear at affordable prices.
          </p>
          <p className="text-gray-600">
            Our journey started with a simple idea: to create footwear that not
            only looks great but also provides comfort and support to our
            customers.
          </p>
          <b className="text-gray-800 text-xl">Our Mission:</b>
          <p className="text-gray-600">
            To be the go-to destination for quality footwear at affordable prices.
          </p>
        </div>
      </div>
      <div className="text-4xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-gray-800">Quality Assurance:</b>
          <p className="text-gray-600">
            We are committed to providing our customers with the highest quality
            footwear at affordable prices.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-gray-800">Convenience:</b>
          <p className="text-gray-600">
            With our User Friendly interface, you can shop for your favorite
            footwear with ease.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-gray-800">Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team is always available to assist you with any questions or
            concerns you may have.
          </p>
        </div>
      </div>

      <NewsLetter />
    </div>
  );
};

export default About;
