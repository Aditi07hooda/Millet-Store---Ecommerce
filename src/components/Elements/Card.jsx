import React, { useState } from 'react';
import {
    Card as CardLayout,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from '@material-tailwind/react';
import { HeartIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';
import Button from '../UI/Button';
import CardDetails from './CardDetails';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../pages/store/slices/cart';

const Card = ({ product, categoryName }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false); // State to manage popover visibility
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const productImage =
        product.oneImg || product.mainImage || (product.images && product.images[0]);
    const productName = product.name || 'No Name Available';
    const availableVariants = product.variants || [];
    const formattedVariants = availableVariants.map(variant => ({
        size: variant.name,
        price: variant.price,
        offerPrice: variant.offerPrice,
    }));

    const getRandomHashtag = (keywords) => {
        if (!keywords || keywords.length === 0) return '#NewArrivals';
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
        return `#${randomKeyword.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '')}`;
    };

    const randomHashtag = getRandomHashtag(product.keywords);

    // Define the current variant to use in Add to Cart
    const currentVariant = selectedVariant || formattedVariants[0];

    // Handle Add to Cart directly from the Card
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

    const togglePopover = () => {
        setIsPopoverVisible(!isPopoverVisible); // Toggle popover visibility
    };

    const closePopover = () => {
        setIsPopoverVisible(false); // Close the popover
    };

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardLayout
                className="bg-secondary bg-opacity-25 transition-transform duration-300"

            >
                <CardHeader shadow={false} floated={false} className="relative h-44" onClick={togglePopover}>
                    <Image
                        src={productImage}
                        alt={productName}
                        className="h-auto max-w-full rounded-lg"
                        layout="fill"
                        objectFit="cover"
                    />
                </CardHeader>
                <CardBody onClick={togglePopover}>
                    <div className="mb-1 flex items-center justify-between">
                        <Typography color="gray" className="font-small text-gray-400">
                            {categoryName}
                        </Typography>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                        <Typography
                            color="blue-gray"
                            className="cursor-default font-semibold truncate whitespace-nowrap"
                        >
                            {productName}
                        </Typography>
                    </div>
                    {formattedVariants.length > 0 && (
                        <div className="mt-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                                Available Sizes and Prices:
                            </Typography>
                            <ul className="mt-2">
                                <li className="text-gray-700">
                                    <span className="text-gray-400 line-through text-sm">
                                        Rs. {formattedVariants[0].price}
                                    </span>
                                    <span className="text-red-600 text-lg ml-2">
                                        Rs. {formattedVariants[0].offerPrice}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}
                </CardBody>
                {isHovered ? (
                    <CardFooter className="pt-0 transition-opacity duration-300 flex justify-between align-middle">
                        <Button text={"Add to Cart"} onClick={handleAddToCart} />
                        <HeartIcon className="h-6 w-6 hover:fill-primary cursor-pointer" />
                    </CardFooter>
                ) : (
                    <span className="inline-block bg-gray-200 rounded-full transition-opacity duration-300 px-3 py-1 ml-3 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {randomHashtag}
                    </span>
                )}
            </CardLayout>

            {/* Conditionally render the CardDetails popover based on isPopoverVisible state */}
            {isPopoverVisible && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={closePopover} // Close when clicking outside
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl h-3/4 overflow-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-gray-700"
                            onClick={closePopover}
                        >
                            ✕
                        </button>
                        <CardDetails product={product} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;
