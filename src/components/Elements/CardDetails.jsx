import Image from 'next/image';
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import Button from '../UI/Button';
import { useDispatch } from 'react-redux';
import { addItemToCartAsync } from '../../store/slices/cart';

const CardDetails = ({ product }) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    isHovered: false,
    isPopoverVisible: false,
    selectedVariant: null,
    selectedSize: null,
  })

  const productImage =
    product.oneImg || product.mainImage || (product.images && product.images[0]);
  const productName = product.name || 'No Name Available';
  const productDescription = product.description || 'No Description Available';
  const availableVariants = product.variants || [];
  const variantType = product.variantTypes[0];
  const availableProductSize = Object.values(product.variantMatrix[variantType]) || [];

  const formattedVariants = availableVariants.map((variant) => ({
    id: variant.id,
    name: productName,
    price: variant.price,
    offerPrice: variant.offerPrice,
    image: productImage,
    size: variant.name,
  }));

  console.log(formattedVariants)

  const calculateSavedPercentage = (price, offerPrice) => {
    if (!price || !offerPrice) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const sanitizedDescription = DOMPurify.sanitize(productDescription);

  const handleSizeSelection = (size) => {
    setState((prev) => {
      return {
        ...prev,
        selectedSize: size,
        selectedVariant: formattedVariants.find((variant) => variant.size === size),
      };
    })
  };

  // The displayed price and saved percentage based on the selected variant
  const currentVariant = state.selectedVariant || formattedVariants[0];
  const savedPercentage = calculateSavedPercentage(
    currentVariant.price,
    currentVariant.offerPrice
  );

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!state.selectedSize || !currentVariant) {
      alert('Please select a variant and size');
      return;
    }

    const cartItem = {
      id: currentVariant.id,
      variantId: currentVariant.id,
      productId: product.id,
      name: currentVariant.name,
      offerPrice: currentVariant.offerPrice,
      image: productImage,
      size: state.selectedSize,
    };
    localStorage.setItem(`image_${cartItem.id}`, cartItem.image)
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
            {availableProductSize.map((size, index) => (
              <button
                key={index}
                className={`border px-3 py-1 rounded ${state.selectedSize === size ? 'bg-secondary' : 'hover:bg-gray-100'
                  }`}
                onClick={() => handleSizeSelection(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button onClick={handleAddToCart} text={'Add To Cart'} />
          <Button text={'Buy Now'} />
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
