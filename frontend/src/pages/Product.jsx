import React, { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "sonner";
import AuthDialog from "../components/ui/authDialog";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Check if auth dialog should be open based on URL
  const authDialogOpen = searchParams.get("auth") === "true";

  const setAuthDialogOpen = (open) => {
    if (open) {
      setSearchParams({ auth: "true" });
    } else {
      setSearchParams({});
    }
  };

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

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login to add items to cart");
      setAuthDialogOpen(true);
      return;
    }

    if (!size) {
      toast.error("Please select a size");
      return;
    }

    setAddingToCart(true);

    try {
      const result = await addToCart(productData._id, size);
      if (result.success) {
        setSize("");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  return productData ? (
    <>
      <div className="border-t-2 border-gray-300 pt-10 transition-opacity ease-in duration-500 opacity-100">
        <div className="flex gap-8 sm:gap-12 flex-col lg:flex-row">
          {/* Product Images */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2 sm:gap-3">
              {productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  key={index}
                  src={item}
                  alt={`Product ${index}`}
                  className="w-[24%] sm:w-full sm:mb-0 cursor-pointer shrink-0 border border-gray-300 rounded hover:border-gray-900 transition-colors"
                />
              ))}
            </div>
            <div className="w-full sm:w-[80%]">
              <img
                className="w-full h-auto border border-gray-300 rounded-lg"
                src={image}
                alt={productData.name}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium mt-2 text-gray-900">{productData.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <img src={assets.star_icon} alt="" className="w-3.5" />
              <img src={assets.star_icon} alt="" className="w-3.5" />
              <img src={assets.star_icon} alt="" className="w-3.5" />
              <img src={assets.star_icon} alt="" className="w-3.5" />
              <img src={assets.star_dull_icon} alt="" className="w-3.5" />
              <p className="pl-2 text-gray-700">84 Reviews</p>
            </div>
            <p className="mt-5 text-3xl font-medium text-gray-900">
              {currency}
              {productData.price}
            </p>
            <div className="flex flex-col gap-4 my-8">
              <p className="text-gray-900 font-medium">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {productData.sizes.map((item, index) => {
                  const sizeValue = typeof item === "string" ? item : item.size;
                  const stockValue =
                    typeof item === "object" ? item.stock : null;

                  return (
                    <button
                      onClick={() => setSize(sizeValue)}
                      className={`border border-gray-300 py-2 px-4 bg-white hover:bg-gray-100 hover:border-gray-900 transition-colors duration-200 cursor-pointer rounded ${
                        size === sizeValue
                          ? "border-black bg-gray-100 ring-2 ring-black"
                          : ""
                      } ${
                        stockValue === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      key={index}
                      disabled={stockValue === 0}
                    >
                      <span className="text-gray-900 font-medium">{sizeValue}</span>
                      {stockValue !== null && stockValue === 0 && (
                        <span className="text-xs block text-red-600 mt-1">
                          Out of Stock
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="bg-black text-white py-3 px-8 text-sm rounded-md 
             my-8 cursor-pointer hover:scale-105 transition-all duration-300 w-full sm:w-auto shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? "ADDING..." : "ADD TO CART"}
            </button>

            <hr className="mt-4 sm:w-4/5 border-gray-300" />
            <div className="text-sm text-gray-700 mt-5 flex flex-col gap-2">
              <p>✓ 100% Original Product</p>
              <p>✓ Cash on Delivery Accepted</p>
              <p>✓ Easy Returns and Exchange Policies within 7 Days</p>
            </div>
          </div>
        </div>

        {/* Description & Reviews */}
        <div className="mt-20">
          <div className="flex border-b border-gray-300">
            <button className="border-b-2 border-black px-5 py-3 text-sm font-medium text-gray-900">
              Description
            </button>
            <button className="px-5 py-3 text-sm text-gray-700 hover:text-gray-900">
              Reviews (83)
            </button>
          </div>
          <div className="flex flex-col gap-4 border border-gray-300 border-t-0 text-sm px-6 py-6 text-gray-700 bg-white rounded-b-lg">
            <p className="leading-relaxed">
              An e-commerce website is an online platform that facilitates the
              buying and selling of products or services over the internet. It
              serves as a virtual marketplace where buyers can discover,
              compare, and purchase products directly from sellers. This
              platform provides a seamless shopping experience with secure
              payment options and reliable delivery services, making online
              shopping convenient and accessible for customers worldwide.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <RelatedProducts
            category={productData.category}
            subcategory={productData.subCategory}
            currentProductId={productData._id}
          />
        </div>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;