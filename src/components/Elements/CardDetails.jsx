import Image from 'next/image';
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import Button from '../UI/Button';
import { useDispatch } from 'react-redux';
import { addItemToCart, increaseItemQuantity, decreaseItemQuantity } from '../../pages/store/slices/cart';

const CardDetails = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState();

  const productImage =
    product.oneImg || product.mainImage || (product.images && product.images[0]);
  const productName = product.name || 'No Name Available';
  const productDescription = product.description || 'No Description Available';
  const availableVariants = product.variants || [];
  const formattedVariants = availableVariants.map((variant) => ({
    size: variant.name,
    price: variant.price,
    offerPrice: variant.offerPrice,
  }));

  const calculateSavedPercentage = (price, offerPrice) => {
    if (!price || !offerPrice) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(increaseItemQuantity({ id: item.id, size: item.size }));
};

const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
        dispatch(decreaseItemQuantity({ id: item.id, size: item.size }));
    }
};

  const sanitizedDescription = DOMPurify.sanitize(productDescription);

  // Handle size selection and update the selected variant
  const handleSizeSelection = (variant) => {
    setSelectedVariant(variant);
  };

  // The displayed price and saved percentage based on the selected variant
  const currentVariant = selectedVariant || formattedVariants[0];
  const savedPercentage = calculateSavedPercentage(
    currentVariant.price,
    currentVariant.offerPrice
  );

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!currentVariant) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      id: product.id,
      name: productName,
      offerPrice: currentVariant.offerPrice,
      image: productImage,
      size: currentVariant.size,
      quantity: quantity,
    };

    dispatch(addItemToCart(cartItem));
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      {/* Image Section */}
      <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
        <Image
          src={productImage}
          alt="Product"
          className="rounded-lg w-full h-auto"
          layout="responsive"
          width={4}
          height={3}
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          {productName}
        </span>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col justify-between md:w-1/2 pl-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{productName}</h2>
          <div className="flex items-center mb-2">
            <span className="line-through text-gray-400 mr-2">
              Rs. {currentVariant.price}
            </span>
            <span className="text-xl font-semibold text-gray-800">
              Rs. {currentVariant.offerPrice}
            </span>
            <span className="ml-2 text-red-600 font-bold bg-red-100 px-2 py-1 rounded">
              Save {savedPercentage}%
            </span>
          </div>
          <p
            className="text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <span className="text-gray-700 font-semibold">Size:</span>
          <div className="flex space-x-2 mt-2">
            {formattedVariants.map((variant) => (
              <button
                key={variant.size}
                className={`border px-3 py-1 rounded ${
                  selectedVariant === variant ? 'bg-secondary' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSizeSelection(variant)}
              >
                {variant.size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded">
            <button
              onClick={decreaseItemQuantity}
              className="px-2 py-1 border-r hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-3">{quantity}</span>
            <button
              onClick={increaseItemQuantity}
              className="px-2 py-1 border-l hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <Button onClick={handleAddToCart} text={'Add To Cart'} />
          <Button text={'Buy Now'} />
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
