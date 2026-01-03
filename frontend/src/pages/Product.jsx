import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [sizeButton, setSizeButton] = useState("");

  // Get Product data by Id
  const fetchProductData = async () => {
    const foundItem = products.find((item) => item._id === productId);
    if (foundItem) {
      setProductData(foundItem);
      setImage(foundItem.image[0]);
      return null;
    }
    setProductData(null);
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Details */}

      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}

        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div
            className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal 
          sm:w-[18.7%] w-full"
          >
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                key={index}
                src={item}
                alt={`Product ${index}`}
                className="w-[24%] sm:w-full sm:mb-3 cursor-pointer shrink-0"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%] ">
            <img className="w-full h-auto" src={image} alt={productData.name} />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium mt-2">{productData.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">84 Reviews</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSizeButton(item)}
                  className={`border py-2 px-4 bg-gray-50 hover:bg-gray-200 transition-colors duration-200 cursor-pointer ${
                    sizeButton === item ? "border-orange-600" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
           <button className="bg-black text-white py-3 cursor-pointer px-8 text-sm rounded-md active:bg-gray-700 transition-colors duration-200">
            ADD TO CART
           </button>
           <hr className="mt-4 sm:w-4/5 border-gray-300" />
        </div>
      </div>
    </div>
  ) : (
    <div className="opacity-0 "></div>
  );
};

export default Product;
