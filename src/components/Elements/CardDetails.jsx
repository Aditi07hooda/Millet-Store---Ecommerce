import Image from 'next/image';
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import Button from '../UI/Button';
import { useDispatch } from 'react-redux';
import { addItemToCartAsync, removeItemFromCartAsync } from '../../store/slices/cart';

const CardDetails = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const productImage =
    product.oneImg || product.mainImage || (product.images && product.images[0]);
  const productName = product.name || 'No Name Available';
  const productDescription = product.description || 'No Description Available';
  const availableVariants = product.variants || [];
  const availableProductSize = product.variantMatrix.Size || [];

  const formattedVariants = availableVariants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    price: variant.price,
    offerPrice: variant.offerPrice,
    sizes: availableProductSize.filter(size => size.variantId === variant.id),
  }));

  const calculateSavedPercentage = (price, offerPrice) => {
    if (!price || !offerPrice) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const handleIncreaseQuantity = (item) => {
    if (selectedSize) {
      dispatch(addItemToCartAsync({ id: item.id, size: selectedSize }));
    } else {
      alert('Please select a size');
    }
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1 && selectedSize) {
      dispatch(removeItemFromCartAsync({ id: item.id, size: selectedSize }));
    }
  };

  const sanitizedDescription = DOMPurify.sanitize(productDescription);

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  // The displayed price and saved percentage based on the selected variant
  const currentVariant = selectedVariant || formattedVariants[0];
  const savedPercentage = calculateSavedPercentage(
    currentVariant.price,
    currentVariant.offerPrice
  );

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a variant and size');
      return;
    }

    const cartItem = {
      id: currentVariant.id,
      name: currentVariant.name,
      offerPrice: currentVariant.offerPrice,
      image: productImage,
      size: selectedSize,
      quantity: quantity,
    };
    dispatch(addItemToCartAsync(cartItem));
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

        {/* Variant and Size Selection */}
        <div className="mb-4">
          <span className="text-gray-700 font-semibold">Sizes:</span>
          <div className="flex space-x-2 mt-2">
            {formattedVariants.map((variant) => (
              <button
                key={variant.id}
                className={`border px-3 py-1 rounded ${selectedVariant === variant ? 'bg-secondary' : 'hover:bg-gray-100'
                  }`}
                onClick={() => handleSizeSelection(variant)}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded">
            <button
              onClick={handleDecreaseQuantity}
              className="px-2 py-1 border-r hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-3">{quantity}</span>
            <button
              onClick={handleIncreaseQuantity}
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
