import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductComponent from "../components/ProductComponent";

const Collections = () => {
  const { products } = useContext(ShopContext);
  const [ShowFilters, setShowFilters] = useState(false);
  const [FilterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(category.filter((item) => item !== e.target.value));
    } else {
      setCategory([...category, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(subCategory.filter((item) => item !== e.target.value));
    } else {
      setSubCategory([...subCategory, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let FilterProductsCopy = FilterProducts.slice();

    switch (sortType) {
      case "low":
        setFilterProducts(FilterProductsCopy.sort((a, b) => a.price - b.price));
        break;

      case "high":
        setFilterProducts(FilterProductsCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-200">
      {/* Filter Section */}

      <div className="min-w-60">
        <p
          onClick={() => setShowFilters(!ShowFilters)}
          className="my-2 text-xl flex items-center gap-2 cursor-pointer"
        >
          FILTERS{" "}
          <img
            className={`h-3 sm:hidden ${ShowFilters ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}

        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            ShowFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-600">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Men"}
                onChange={toggleCategory}
              />
              <span>Men</span>
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Women"}
                onChange={toggleCategory}
              />
              <span>Women</span>
            </p>
          </div>
        </div>

        {/* Subcategory Filter */}

        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            ShowFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-600">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Casual"}
                onChange={toggleSubCategory}
              />
              <span>Casual</span>
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Sports"}
                onChange={toggleSubCategory}
              />
              <span>Sports</span>
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Formal"}
                onChange={toggleSubCategory}
              />
              <span>Formal</span>
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* Sort Products */}
          <select
            onChange={(e) => {
              setSortType(e.target.value);
            }}
            className="border-2 border-gray-300 p-2 text-sm"
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="low">Sort By: Lowest Price</option>
            <option value="high">Sort By: Highest Price</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {FilterProducts.map((item, index) => (
            <ProductComponent
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
