// frontend/src/components/CartTotal.jsx
import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({ cartTotal }) => {
  const { currency, deliveryFee } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTAL"} />
        <div className="flex flex-col gap-2 mt-2 text-sm">
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>
              {currency} {cartTotal}.00
            </p>
          </div>
          <hr />
          <div className="flex justify-between">
            <p>Shipping Fee:</p>
            <p>
              {currency} {deliveryFee}.00
            </p>
          </div>
          <hr />
          <div className="flex justify-between">
            <b>Total</b>
            <b>
              {currency} {cartTotal === 0 ? 0 : cartTotal + deliveryFee}.00
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
