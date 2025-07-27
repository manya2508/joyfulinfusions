import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return product && (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition duration-300 flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-center h-40 mb-3 overflow-hidden">
        <img
          className="object-contain max-h-full max-w-full transition-transform duration-300 group-hover:scale-105"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="text-gray-500 text-sm mb-2">
          <p>{product.category}</p>
          <p className="text-gray-800 font-semibold text-lg truncate">{product.name}</p>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <p className="text-primary font-medium text-base md:text-xl">
            {currency}{product.offerPrice}
          </p>

          <div onClick={(e) => e.stopPropagation()} className="text-primary">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 px-2 md:w-[80px] w-[64px] h-[34px] rounded"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="cart_icon" className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{cartItems[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
