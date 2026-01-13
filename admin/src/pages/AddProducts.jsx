import React from "react";
import { assets } from "../admin_assets/assets";

const AddProducts = () => {
  return (
    <form className="flex flex-col w-full items-start gap-3">
      <p className="mb-2">Upload Product Image (max 4)</p>
      <div className="flex gap-2">
        <label htmlFor="images">
          <img
            className=" pt-2 w-30 cursor-pointer hover:scale-105 transition-smooth duration-300 ease-in-out"
            src={assets.upload_area}
            alt="Upload Area"
          />
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => setImages(e.target.files)}
          />
        </label>
      </div>

      <div className="w-1/4">
        <p className="mb-2">Product Name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type Here"
          required
        />
      </div>

      <div>
        <div>
          <p>Product Category</p>
          <select>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
      </div>
    </form>
  );
};

export default AddProducts;
