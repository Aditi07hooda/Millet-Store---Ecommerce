import React, { useState } from "react";
import {
  Card as CardLayout,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import Button from "../UI/Button";
import { useRouter } from "next/router";
import logo from "../../Image/logo.png";
import { addItemToCartAsync, fetchCartItemsAsync } from "@/store/slices/cart";
import { useDispatch } from "react-redux";
import Image from "next/image";

const Card = ({ product, categoryName }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    selectedVariant: null,
    selectedSize: null,
    isAddedToCart: false,
  });

  const productImage =
    product.oneImg ||
    product.mainImage ||
    (product.images && product.images[0]) ||
    logo.src;

  const productName = product.name || "No Name Available";
  const availableVariants = product.variants || [];
  const formattedVariants = availableVariants.map((variant) => ({
    id: variant.id,
    image: productImage,
    size: variant.name,
    price: variant.price,
    offerPrice: variant.offerPrice,
  }));

  // Handle Add to Cart directly from the Card
  const handleAddToCart = () => {
    const cartItem = {
      variantId: formattedVariants[0].id,
      id: formattedVariants[0].id,
      name: productName,
      price: formattedVariants[0].price,
      offerPrice: formattedVariants[0].offerPrice,
      image: productImage,
      size: formattedVariants[0].size,
    };

    localStorage.setItem(`image_${cartItem.id}`, cartItem.image);
    dispatch(addItemToCartAsync(cartItem));
    setState((prevState) => ({ ...prevState, isAddedToCart: true }));
    dispatch(fetchCartItemsAsync());
  };

  const handleProductClick = (slug) => {
    router.push(`/product/${slug}`);
  };

  return (
    <div className="h-100">
      <CardLayout className="bg-secondary bg-opacity-25 transition-transform duration-300 cursor-pointer">
        <CardHeader
          shadow={"false"}
          floated={"false"}
          className="h-52 w-auto relative flex flex-wrap"
          onClick={() => handleProductClick(product.slug)}
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={productName}
              className="h-auto max-w-full w-max rounded-lg"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Image
              alt="The millet store"
              src={logo.src}
              className="h-auto max-w-full w-max rounded-lg"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </CardHeader>
        <CardBody onClick={() => handleProductClick(product.slug)}>
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
        <CardFooter className="pt-0 transition-opacity duration-300 flex justify-between align-middle">
          <Button text={"Add to Cart"} onClick={handleAddToCart} />
          {state.isAddedToCart && (
            <span className="inline-block text-green-500 transition-opacity duration-300 px-3 py-1 text-xs font-semibold">
              Added to Cart
            </span>
          )}
        </CardFooter>
      </CardLayout>
    </div>
  );
};

export default Card;
