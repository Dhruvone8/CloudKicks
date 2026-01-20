import React, { useContext, useState, useRef, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { SaveButton } from "@/components/ui/status-button";
import { ShopContext } from "@/context/ShopContext";
import { toast } from "sonner";

const Checkout = () => {
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
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

  const [cartData, setCartData] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { navigate, backendUrl, token, deliveryFee, currency } =
    useContext(ShopContext);

  const formRef = useRef(null);

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      if (!token) {
        toast.error("Please login to continue");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/cart`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setCartData(data.cartData);

          // Calculate total
          const total = data.cartData.reduce((sum, item) => {
            if (item.product) {
              return sum + item.product.price * item.quantity;
            }
            return sum;
          }, 0);

          setCartTotal(total);
        } else {
          toast.error("Failed to load cart");
          navigate("/cart");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart items");
        navigate("/cart");
      }
    };

    fetchCartData();
  }, [token, backendUrl, navigate]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isProcessing) {
      return;
    }

    // Check if user is logged in
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/");
      return;
    }

    // Check if cart is empty
    if (!cartData || cartData.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cartData.map((item) => ({
        product: item.product._id,
        size: item.size,
        quantity: item.quantity,
      }));

      const address = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipcode: formData.zipCode,
        phone: formData.phone,
      };

      // Calculate total amount (cart total + delivery fee)
      const totalAmount = cartTotal + deliveryFee;

      const orderData = {
        items: orderItems,
        amount: totalAmount,
        address: address,
      };

      // Handle different payment methods
      if (method === "cod") {
        // Cash on Delivery
        const response = await fetch(`${backendUrl}/orders/cod`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (data.success) {
          setCartData([]);
          setCartTotal(0);
          toast.success(data.message || "Order placed successfully!");
          setTimeout(() => {
            navigate("/orders");
          }, 500);
        } else {
          toast.error(data.message || "Failed to place order");
          setIsProcessing(false);
        }
      } else if (method === "stripe") {
        // Stripe Payment
        const response = await fetch(`${backendUrl}/orders/stripe`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (data.success) {
          // Redirect to Stripe checkout
          window.location.href = data.session_url;
        } else {
          toast.error(data.message || "Failed to create payment session");
          setIsProcessing(false);
        }
      } else if (method === "razorpay") {
        // Razorpay Payment (to be implemented)
        toast.error("Razorpay payment not implemented yet");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Section - Delivery Information */}
      <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First Name"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
            disabled={isProcessing}
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
            disabled={isProcessing}
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
          required
          disabled={isProcessing}
        />
        <input
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
          required
          disabled={isProcessing}
        />
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
            disabled={isProcessing}
          />
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
            disabled={isProcessing}
          />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipCode"
            value={formData.zipCode}
            type="text"
            placeholder="ZIP Code"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
            disabled={isProcessing}
          />
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
            required
            disabled={isProcessing}
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="tel"
          placeholder="Phone No."
          className="border border-gray-700 rounded py-1.5 px-3.5 w-full"
          required
          disabled={isProcessing}
        />
      </div>

      {/* Right Section - Order Summary */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal cartTotal={cartTotal} />
        </div>
        <div className="mt-12 text-lg">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* Payment Methods */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => !isProcessing && setMethod("stripe")}
              className={`flex items-center gap-3 border p-2 px-3 ${
                isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <p
                className={`min-w-3 h-3 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-2" src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div
              onClick={() => !isProcessing && setMethod("razorpay")}
              className={`flex items-center gap-3 border p-2 px-3 ${
                isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <p
                className={`min-w-3 h-3 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-2"
                src={assets.razorpay_logo}
                alt="Razorpay"
              />
            </div>
            <div
              onClick={() => !isProcessing && setMethod("cod")}
              className={`flex items-center gap-3 border p-2 px-3 ${
                isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
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
            <SaveButton
              onValidate={() => {
                // Check if form is valid before starting animation
                if (formRef.current && formRef.current.checkValidity()) {
                  return true;
                } else {
                  if (formRef.current) {
                    formRef.current.reportValidity();
                  }
                  return false;
                }
              }}
              onComplete={() => {
                if (!isProcessing) {
                  formRef.current.requestSubmit();
                }
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Checkout;