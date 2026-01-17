import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductComponent from "./ProductComponent";

const RelatedProducts = ({ category, subcategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setrelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      // Filter by category and subcategory
      productsCopy = productsCopy.filter((item) => category === item.category);
      
      // Fix: Check for both subcategory and subCategory
      productsCopy = productsCopy.filter(
        (item) => subcategory === item.subCategory || subcategory === item.subcategory
      );

      // Exclude the current product
      productsCopy = productsCopy.filter((item) => item._id !== currentProductId);

      setrelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subcategory, currentProductId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      {related.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {related.map((item, index) => (
            <ProductComponent
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No related products found</p>
      )}
    </div>
  );
};

export default RelatedProducts;