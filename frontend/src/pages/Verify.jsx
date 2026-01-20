import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "sonner";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(ShopContext);
  const [verifying, setVerifying] = useState(true);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!token) {
        toast.error("Please login to continue");
        navigate("/");
        return;
      }

      if (!orderId) {
        toast.error("Invalid order");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/orders/verifyStripe`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            success,
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Payment verified successfully!");
          navigate("/orders");
        } else {
          toast.error(data.message || "Payment verification failed");
          navigate("/cart");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Failed to verify payment");
        navigate("/cart");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId, success, token, backendUrl, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Verifying your payment...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait</p>
          </>
        ) : (
          <p className="text-gray-600">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default Verify;