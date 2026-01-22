import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductComponent = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  
  // Handle both array of strings and array of objects with url property
  const imageUrl = image && image.length > 0 
    ? (typeof image[0] === 'string' ? image[0] : image[0]?.url)
    : '';

  return (
    <Link 
      className="text-gray-900 cursor-pointer group" 
      to={`/product/${id}`}
    >
      <div className="overflow-hidden border border-gray-300 rounded-lg bg-white">
        <img
          className="hover:scale-110 transition duration-300 ease-in-out w-full h-auto"
          src={imageUrl}
          alt={name || "Product"}
        />
      </div>
      <p className="pt-3 pb-1 text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-sm font-semibold text-gray-900">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductComponent;