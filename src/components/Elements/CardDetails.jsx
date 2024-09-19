import Image from 'next/image';
import React, { useState } from 'react';
import DOMPurify from 'dompurify';

const CardDetails = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);

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

    // Function to calculate the percentage saved
    const calculateSavedPercentage = (price, offerPrice) => {
        if (!price || !offerPrice) return 0;
        return Math.round(((price - offerPrice) / price) * 100);
    };

    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const sanitizedDescription = DOMPurify.sanitize(productDescription);

    // Handle size selection and update the selected variant
    const handleSizeSelection = (variant) => {
        setSelectedVariant(variant);
    };

    // Determine the displayed price and saved percentage based on the selected variant
    const currentVariant = selectedVariant || formattedVariants[0]; // Default to the first variant if none is selected
    const savedPercentage = calculateSavedPercentage(currentVariant.price, currentVariant.offerPrice);

    return (
        <>
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
                    <Image
                        src={productImage}
                        alt="Product"
                        className="rounded-lg w-full h-auto"
                        layout="responsive" // Adjusts the image size responsively
                        width={4}           // Aspect ratio of the image, you can adjust it as needed
                        height={3}          // Aspect ratio of the image, you can adjust it as needed
                        objectFit="cover"   // Ensures the image covers the container properly
                        sizes="(max-width: 768px) 100vw, 50vw" // Define responsive sizes for the image
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
                            <span className="line-through text-gray-400 mr-2">Rs. {currentVariant.price}</span>
                            <span className="text-xl font-semibold text-gray-800">Rs. {currentVariant.offerPrice}</span>
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
                                    className={`border px-3 py-1 rounded ${selectedVariant === variant ? 'bg-green-100' : 'hover:bg-gray-100'
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
                                onClick={decreaseQuantity}
                                className="px-2 py-1 border-r hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="px-3">{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="px-2 py-1 border-l hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                        <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                            Add To Cart
                        </button>
                        <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardDetails;
