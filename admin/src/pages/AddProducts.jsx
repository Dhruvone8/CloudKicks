import React, { useEffect, useState } from "react";
import { assets } from "../admin_assets/assets";
import { SaveButton } from "@/components/ui/status-button";
import { toast, Toaster } from "sonner";
import { StepOutFreeIcons } from "@hugeicons/core-free-icons/index";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate, useSearchParams } from "react-router-dom";

const AddProducts = ({ token }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editProductId = searchParams.get("edit");
  const isEditMode = Boolean(editProductId);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Casual");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([{ size: "UK-7", stock: 0 }]);
  const [loading, setLoading] = useState(false);

  // Fetch Product Data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [editProductId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/products/list`);

      if (response.data.success) {
        const product = response.data.products.find(
          (p) => p._id === editProductId,
        );

        if (product) {
          setName(product.name);
          setPrice(product.price);
          setCategory(product.category);
          setSubCategory(product.subCategory);
          setBestSeller(product.bestSeller);
          setSizes(product.sizes || []);
          setExistingImages(product.images || []);
        } else {
          toast.error("Product Not Found");
          navigate("/list");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch Product data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle File Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      toast.error("You can upload max 4 images");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  // Delete new image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete existing image
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle Size Selection
  const toggleSize = (size) => {
    setSizes((prev) => {
      const exists = prev.find((s) => s.size === size);

      if (exists) {
        // Remove size if already selected
        return prev.filter((s) => s.size !== size);
      } else {
        return [...prev, { size, stock: 0 }];
      }
    });
  };

  // Highlight the selected size
  const isSelected = (size) => {
    return sizes.some((s) => s.size === size);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validation - only check for images if not in edit mode OR if all images were removed
    if (isEditMode && images.length === 0 && existingImages.length === 0) {
      toast.error("Please keep or upload at least one image");
      return;
    }

    // In edit mode, check if there's at least one image (existing or new)
    if (!isEditMode && images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    try {
      if (isEditMode) {
        // Update product
        const updateData = {
          name,
          price: price.toString(),
          category,
          subCategory,
          bestSeller: bestSeller ? "true" : "false",
          sizes: JSON.stringify(sizes),
          existingImages: JSON.stringify(existingImages),
        };

        const response = await axios.patch(
          `${backendUrl}/products/update/${editProductId}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Product updated successfully");
        navigate("/list");
      } else {
        // Add new product
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price.toString());
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        formData.append("bestSeller", bestSeller ? "true" : "false");
        formData.append("sizes", JSON.stringify(sizes));

        images.forEach((image) => {
          formData.append("images", image);
        });

        const response = await axios.post(
          backendUrl + "/products/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Product added successfully");

        // Reset form
        setImages([]);
        setExistingImages([]);
        setName("");
        setPrice(0);
        setSizes([]);
        setBestSeller(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const updateStock = (size, stock) => {
    setSizes((prev) =>
      prev.map((s) =>
        s.size === size ? { ...s, stock: parseInt(stock) || 0 } : s,
      ),
    );
  };

  const getStock = (size) => {
    const sizeData = sizes.find((s) => s.size === size);
    return sizeData ? sizeData.stock : 0;
  };

  if (loading) {
    return <div className="text-center py-8">Loading product data...</div>;
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-semibold">
          {isEditMode ? "Update Product" : "Add New Product"}
        </h2>
        {isEditMode && (
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Cancel
          </button>
        )}
      </div>

      <p className="mb-2">Upload Product Image (max 4)</p>
      <div className="flex gap-2 flex-wrap">
        {/* Existing Images (in edit mode) */}
        {existingImages.map((img, index) => (
          <div key={`existing-${index}`} className="relative">
            <img
              src={img.url}
              alt={`Product ${index}`}
              className="w-24 h-24 object-cover rounded border"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => removeExistingImage(index)}
            >
              &times;
            </button>
          </div>
        ))}

        {/* New Images */}
        {images.length === 0 && existingImages.length === 0 && (
          <label htmlFor="images">
            <img
              className="pt-2 w-30 cursor-pointer hover:scale-105 transition-smooth duration-300 ease-in-out"
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
              onChange={handleImageChange}
            />
          </label>
        )}

        {images.map((img, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={URL.createObjectURL(img)}
              alt={`Product ${index}`}
              className="w-24 h-24 object-cover rounded border"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => removeImage(index)}
            >
              &times;
            </button>
          </div>
        ))}

        {images.length + existingImages.length < 4 && (
          <label htmlFor="images">
            <img
              className="pt-2 w-30 cursor-pointer hover:scale-105 transition:smooth duration-300 ease-in-out"
              src={assets.upload_area}
              alt="Upload More"
            />
            <input
              type="file"
              name="images"
              id="images"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      <div className="w-1/4">
        <p className="mb-2">Product Name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2 border rounded"
          type="text"
          placeholder="Type Here"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub-Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Casual">Casual</option>
            <option value="Sports">Sports</option>
            <option value="Formal">Formal</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px] border rounded"
            type="Number"
            placeholder="999"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["UK-5", "UK-6", "UK-7", "UK-8", "UK-9", "UK-10"].map((size) => (
            <div
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 cursor-pointer border rounded
          ${isSelected(size) ? "bg-black text-white" : "bg-slate-200"}`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Stock Management Section */}
      {sizes.length > 0 && (
        <div className="w-full">
          <p className="mb-2 font-semibold">Stock Management</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {sizes.map((sizeData) => (
              <div key={sizeData.size} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{sizeData.size}</label>
                <input
                  type="number"
                  min="0"
                  value={sizeData.stock}
                  onChange={(e) => updateStock(sizeData.size, e.target.value)}
                  className="px-3 py-2 border rounded"
                  placeholder="Stock qty"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Total Stock: {sizes.reduce((acc, s) => acc + s.stock, 0)} units
          </p>
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestSeller}
          type="checkbox"
          id="bestSeller"
        />
        <label className="cursor-pointer" htmlFor="bestSeller">
          Add to Best Seller
        </label>
      </div>

      <button
        className="bg-black text-white py-2 rounded-md text-md my-6 px-6
              cursor-pointer hover:scale-105 transition-all duration-300 w-full sm:w-auto shadow-md"
      >
        {isEditMode ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default AddProducts;
