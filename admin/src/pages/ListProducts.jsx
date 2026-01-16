import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { backendUrl, currency } from "../App";

const ListProducts = () => {
  const [list, setList] = useState([]);

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

      const response = await axios.delete(
        `${backendUrl}/products/remove/${productId}`,
        { withCredentials: true }
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

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>

      <div className="flex flex-col gap-2">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2 px-2 border bg-gray-100 text-sm font-semibold">
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
              className="border rounded-lg p-3 md:p-0 md:border-b md:rounded-none 
                         grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] 
                         gap-3 md:gap-2 items-center text-sm bg-white"
            >
              {/* Image */}
              <div className="flex md:block justify-center">
                <img
                  className="w-16 md:w-12 object-cover"
                  src={item.images?.[0]?.url}
                  alt="thumbnail"
                />
              </div>

              {/* Name */}
              <div>
                <span className="md:hidden text-gray-400 text-xs">Name</span>
                <p className="font-medium">{item.name}</p>
              </div>

              {/* Price */}
              <div>
                <span className="md:hidden text-gray-400 text-xs">Price</span>
                <p>
                  {currency} {item.price}
                </p>
              </div>

              {/* Category */}
              <div>
                <span className="md:hidden text-gray-400 text-xs">
                  Category
                </span>
                <p>{item.category}</p>
              </div>

              {/* Stock */}
              <div>
                <span className="md:hidden text-gray-400 text-xs">Stock</span>
                <p>{item.stock}</p>
              </div>

              {/* Action */}
              <div className="text-right md:text-center">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-500 text-xl font-bold hover:scale-110 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No products found</p>
        )}
      </div>
    </>
  );
};

export default ListProducts;
