import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import Title from "../component/Title";

function ProductDetail() {
  const { id } = useParams();
  const { products, currency, addToCart } = useContext(shopDataContext);
  const [selectedSize, setSelectedSize] = useState("");

  const product = products.find((p) => p._id === id);

  // If product not found or is inappropriate
  if (!product || product.name.toLowerCase().includes("sex") || product.category?.toLowerCase() === "adult") {
    return (
      <div className="text-white text-center mt-20">
        This product is unavailable.
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product._id, selectedSize);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-l from-[#141414] to-[#0c2025] text-white p-5">
      <Title text1="Product" text2="Detail" />

      <div className="flex flex-col items-center gap-6 mt-10">
        {/* Product Image */}
        <img
          src={product.image1}
          alt={product.name}
          className="w-full max-w-[300px] h-auto object-contain rounded-md shadow-md"
        />

        {/* Product Name */}
        <h1 className="text-2xl font-bold">{product.name}</h1>

        {/* Price */}
        <p className="text-lg text-teal-300">
          {currency} {product.price}
        </p>

        {/* Description */}
        <div className="max-w-[600px] w-full text-sm md:text-base bg-[#1a1a1a] p-4 rounded-md max-h-[150px] overflow-y-auto whitespace-pre-wrap">
          {product.description}
        </div>

        {/* Size Selection */}
        <div className="w-full max-w-[300px] text-left">
          <p className="mt-4 mb-2 font-semibold">Select Size:</p>
          <div className="flex gap-3 flex-wrap">
            {product.sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-md ${
                  selectedSize === size
                    ? "bg-teal-500 text-white border-white"
                    : "bg-transparent text-white border-teal-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-6 bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-md text-white font-semibold transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
