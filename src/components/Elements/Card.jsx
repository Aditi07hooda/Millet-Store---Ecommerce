import React, { useState } from "react";
import {
  Card as CardLayout,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/outline";
import Button from "../UI/Button";
import { useRouter } from "next/router";

const Card = ({ product, categoryName }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const productImage =
    product.oneImg ||
    product.mainImage ||
    (product.images && product.images[0]);
  const productName = product.name || "No Name Available";
  const availableVariants = product.variants || [];
  const formattedVariants = availableVariants.map((variant) => ({
    size: variant.name,
    price: variant.price,
    offerPrice: variant.offerPrice,
  }));

  const getRandomHashtag = (keywords) => {
    if (!keywords || keywords.length === 0) return "#NewArrivals";
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    return `#${randomKeyword
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9_]/g, "")}`;
  };

  const randomHashtag = getRandomHashtag(product.keywords);

  // Handle Add to Cart directly from the Card
  const handleAddToCart = () => {};

  const handleProductClick = (slug) => {
    router.push(`/product/${slug}`);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardLayout
        className="bg-secondary bg-opacity-25 transition-transform duration-300 cursor-pointer"
        onClick={() => handleProductClick(product.slug)}
      >
        <CardHeader shadow={"false"} floated={"false"} className="relative">
          {productImage && (
            <img
              src={productImage}
              alt={productName}
              className="h-auto max-w-full w-max rounded-lg"
              //layout="fill"
              // objectFit="cover"
            />
          )}
        </CardHeader>
        <CardBody>
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
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium"
              >
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
    </div>
  );
};

export default Card;
