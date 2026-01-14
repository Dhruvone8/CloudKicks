import React from "react";
import { assets } from "../admin_assets/assets";
import { SaveButton } from "@/components/ui/status-button";
import { toast } from "sonner";

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

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select className="w-full px-3 py-2">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub-Category</p>
          <select className="w-full px-3 py-2">
            <option value="Casual">Casual</option>
            <option value="Sports">Sports</option>
            <option value="Formal">Formal</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            className="w-full px-3 py-2 sm:w-[120px]"
            type="Number"
            placeholder="999"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">UK-5</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">UK-6</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">UK-7</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">UK-8</p>
          </div>
          <div>
            <p className="bg-slate-200 px-3 py-1 cursor-pointer">UK-9</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input type="checkbox" id="bestSeller" />
        <label className="cursor-pointer" htmlFor="bestSeller">
          Add to Best Seller
        </label>
      </div>

      <SaveButton
        onComplete={() => toast.success("Product added successfully")}
      />
    </form>
  );
};

export default AddProducts;
