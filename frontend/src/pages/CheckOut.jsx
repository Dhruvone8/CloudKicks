import React, { useContext, useState, useRef } from "react"; // Added useRef
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import { SaveButton } from "@/components/ui/status-button";
import { ShopContext } from "@/context/ShopContext";

const Checkout = () => {
  const [method, setMethod] = useState("razorpay");
  const [fromData, setFromData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  
  const { navigate, backendUrl, token, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    
  const formRef = useRef(null);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    try {
        console.log("Form Submitted with data:", fromData);
        console.log("Payment Method:", method);

        // Navigate after processing is done
        navigate("/orderS");
    } catch (error) {
        console.error("Order submission failed:", error);
    }
  };

  return (
    <form 
      ref={formRef} // 3. Attach ref to form
      onSubmit={onSubmitHandler} // 4. Attach submit handler
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Section - Order Details */}
      <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={fromData.firstName}
            type="text"
            placeholder="First Name"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required // Recommended: Add required attributes for validation
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={fromData.lastName}
            type="text"
            placeholder="Last Name"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={fromData.email}
          type="email"
          placeholder="Email Address"
          className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
          required
        />
        <input
          onChange={onChangeHandler}
          name="street"
          value={fromData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
          required
        />
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="city"
            value={fromData.city}
            type="text"
            placeholder="City"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="state"
            value={fromData.state}
            type="text"
            placeholder="State"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipCode"
            value={fromData.zipCode}
            type="number"
            placeholder="ZIP Code"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="country"
            value={fromData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="phone"
          value={fromData.phone}
          type="number"
          placeholder="Phone No."
          className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
          required
        />
      </div>

      {/* Right Section - Order Summary */}
      <div className="mt-8 ">
        <div className="mt-8 min-w-80 ">
          <CartTotal />
        </div>
        <div className="mt-12 text-lg">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* Payment Method */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 cursor-pointer px-3"
            >
              <p
                className={`min-w-3 h-3 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-2" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 cursor-pointer px-3"
            >
              <p
                className={`min-w-3 h-3 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-2" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 cursor-pointer px-3"
            >
              <p
                className={`min-w-3 h-3 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-900 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            {/* 5. Trigger form submit when animation completes */}
            <SaveButton onComplete={() => formRef.current.requestSubmit()} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Checkout;