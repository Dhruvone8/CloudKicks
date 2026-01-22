import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { backendUrl, currency } from "../App";
import { useNavigate } from "react-router-dom";

const ListProducts = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/products/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const removeProduct = async (productId) => {
    try {
      console.log("Product ID:", productId);

      const token = localStorage.getItem("adminToken");

      const response = await axios.delete(
        `${backendUrl}/products/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        toast.success("Product removed successfully");
        await fetchList();
      } else {
        toast.error("Failed to remove product");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("DELETE ERROR:", error);
    }
  };

  const updateProduct = (productId) => {
    navigate(`/add?edit=${productId}`);
  };

  const getTotalStock = (sizes) => {
    if (!sizes || !Array.isArray(sizes)) return 0;
    return sizes.reduce((total, size) => total + (size.stock || 0), 0);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-4 text-xl font-semibold text-gray-900">All Products List</p>

      <div className="flex flex-col gap-2">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-900 rounded-t">
          <span>Image</span>
          <span>Name</span>
          <span>Price</span>
          <span>Category</span>
          <span>Stock</span>
          <span className="text-center">Action</span>
        </div>

        {/* Products */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 md:p-0 md:border md:rounded-none 
                         grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] 
                         gap-3 md:gap-2 items-center text-sm bg-white hover:bg-gray-50 transition-colors"
            >
              {/* Image */}
              <div className="flex md:block justify-center md:px-4">
                <img
                  className="w-16 md:w-14 h-16 md:h-14 object-cover border border-gray-300 rounded"
                  src={item.images?.[0]?.url}
                  alt="thumbnail"
                />
              </div>

              {/* Name */}
              <div className="md:px-2">
                <span className="md:hidden text-gray-600 text-xs font-medium block mb-1">
                  Product Name
                </span>
                <p className="font-medium text-gray-900">{item.name}</p>
              </div>

              {/* Price */}
              <div className="md:px-2">
                <span className="md:hidden text-gray-600 text-xs font-medium block mb-1">
                  Price
                </span>
                <p className="text-gray-900 font-semibold">
                  {currency} {item.price}
                </p>
              </div>

              {/* Category */}
              <div className="md:px-2">
                <span className="md:hidden text-gray-600 text-xs font-medium block mb-1">
                  Category
                </span>
                <p className="text-gray-800">{item.category}</p>
              </div>

              {/* Stock */}
              <div className="md:px-2">
                <span className="md:hidden text-gray-600 text-xs font-medium block mb-1">
                  Total Stock
                </span>
                <p className="text-gray-800">{getTotalStock(item.sizes)}</p>
              </div>

              {/* Action */}
              <div className="text-right md:text-center flex justify-end md:justify-center gap-4 md:px-2">
                <button
                  onClick={() => updateProduct(item._id)}
                  className="text-blue-600 text-lg font-bold hover:scale-125 transition cursor-pointer"
                  title="Edit Product"
                >
                  ✎
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-600 text-xl font-bold hover:scale-125 transition cursor-pointer"
                  title="Delete Product"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-8 border border-gray-300 rounded bg-white">
            No products found
          </div>
        )}
      </div>
    </>
  );
};

export default ListProducts;