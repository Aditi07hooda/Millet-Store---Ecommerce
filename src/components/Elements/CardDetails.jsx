import Image from 'next/image';
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import Button from '../UI/Button';
import { useDispatch } from 'react-redux';
import { addItemToCartAsync } from '../../store/slices/cart';
import { getSessionId } from '@/store/LocalStorage';

const CardDetails = ({ product }) => {
  const dispatch = useDispatch();

  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Extracting product details with fallback values
  const {
    oneImg,
    mainImage,
    images = [],
    name = 'No Name Available',
    description = 'No Description Available',
    variants = [],
    variantTypes = [],
    variantMatrix = {}
  } = product;

  const productImage = oneImg || mainImage || images[0];
  const variantType = variantTypes[0];
  const availableProductSize = Object.values(variantMatrix[variantType] || {});

  const formattedVariants = variants.map((variant) => ({
    id: variant.id,
    name,
    price: variant.price,
    offerPrice: variant.offerPrice,
    image: productImage,
    size: variant.name,
  }));

  const calculateSavedPercentage = (price, offerPrice) => {
    if (!price || !offerPrice) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const sanitizedDescription = DOMPurify.sanitize(description);

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
    const selected = formattedVariants.find((variant) => variant.size === size);
    setSelectedVariant(selected);
  };

  const currentVariant = selectedVariant || formattedVariants[0];
  const savedPercentage = calculateSavedPercentage(
    currentVariant?.price,
    currentVariant?.offerPrice
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      variantId: currentVariant.id,
      id: currentVariant.id,
      name: currentVariant.name,
      offerPrice: currentVariant.offerPrice,
      image: productImage,
      size: selectedSize,
    };

    localStorage.setItem(`image_${cartItem.id}`, cartItem.image);
    dispatch(addItemToCartAsync(cartItem));
    console.log('Session after add to cart:', getSessionId());
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      {/* Image Section */}
      <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
        <Image
          src={productImage}
          alt={name}
          className="rounded-lg w-full h-auto"
          layout="responsive"
          width={4}
          height={3}
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          {name}
        </span>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col justify-between md:w-1/2 pl-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{name}</h2>
          <div className="flex items-center mb-2">
            <span className="line-through text-gray-400 mr-2">
              Rs. {currentVariant?.price}
            </span>
            <span className="text-xl font-semibold text-gray-800">
              Rs. {currentVariant?.offerPrice}
            </span>
            {savedPercentage > 0 && (
              <span className="ml-2 text-red-600 font-bold bg-red-100 px-2 py-1 rounded">
                Save {savedPercentage}%
              </span>
            )}
          </div>
          <p
            className="text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <span className="text-gray-700 font-semibold">Sizes:</span>
          <div className="flex space-x-2 mt-2">
            {availableProductSize.map((size, index) => (
              <button
                key={index}
                className={`border px-3 py-1 rounded ${selectedSize === size ? 'bg-secondary' : 'hover:bg-gray-100'}`}
                onClick={() => handleSizeSelection(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button onClick={handleAddToCart} text="Add To Cart" />
          <Button text="Buy Now" />
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
