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
      <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
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
            <div className="w-full sm:w-[80%]">
              <img className="w-full h-auto" src={image} alt={productData.name} />
            </div>
          </div>

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
                {productData.sizes.map((item, index) => {
                  const sizeValue = typeof item === "string" ? item : item.size;
                  const stockValue = typeof item === "object" ? item.stock : null;

                  return (
                    <button
                      onClick={() => setSize(sizeValue)}
                      className={`border py-2 px-4 bg-gray-50 hover:bg-gray-200 transition-colors duration-200 cursor-pointer ${
                        size === sizeValue ? "border-orange-600 bg-orange-50" : ""
                      } ${
                        stockValue === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      key={index}
                      disabled={stockValue === 0}
                    >
                      {sizeValue}
                      {stockValue !== null && stockValue === 0 && (
                        <span className="text-xs block text-red-500">
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
              hover:bg-gray-800 active:bg-gray-700 
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? "ADDING..." : "ADD TO CART"}
            </button>

            <hr className="mt-4 sm:w-4/5 border-gray-300" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original Product</p>
              <p>Cash on Delivery Accepted</p>
              <p>Easy Returns and Exchange Policies within 7 Days</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex">
            <b className="border px-5 py-3 text-sm">Description</b>
            <p className="border px-5 py-3 text-sm">Reviews (83)</p>
          </div>
          <div className="flex flex-col gap-4 border text-sm px-6 py-6 text-gray-500">
            <p>
              An e-commerce website is an online platform that facilitates the
              buying and selling of products or services over the internet. It
              serves as a virtual marketplace where buyers can discover, compare,
              and purchase products directly from sellers. This platform provides
              a seamless shopping experience with secure payment options and
              reliable delivery services, making online shopping convenient and
              accessible for customers worldwide.
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