import React, { useEffect } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItemsAsync, addItemToCartAsync, removeItemFromCartAsync } from '../store/slices/cart';
import Link from 'next/link';
import Button from '@/components/UI/Button';
import { RiDeleteBinLine } from "react-icons/ri";

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    // console.log(cartItems)
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const totalAmount = useSelector((state) => state.cart.totalAmount);
    const shipping = 7.0;
    const totalPrice = totalAmount + shipping;

    useEffect(() => {
        dispatch(fetchCartItemsAsync());
    }, [dispatch]);

    const handleIncreaseQuantity = (item) => {
        // console.log(item)
        dispatch(addItemToCartAsync({ id: item.variantId, size: item.variantName }));
    };

    const handleDecreaseQuantity = (item) => {
        // console.log(item)
        if (item.qty > 0) {
            dispatch(removeItemFromCartAsync(item));
        }
    };

    const handleRemoveItem = (item) => {
        dispatch(removeItemFromCartAsync({ id: item.id, size: item.size }));
    };

    return (
        <div className="flex flex-col md:flex-row justify-between p-6 max-w-5xl mx-auto">
            {/* Cart Section */}
            <div className="w-full md:w-2/3">
                <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                    cartItems.map((item) => (
                        <div
                            key={`${item.id}-${item.size}`}
                            className="flex px-4 py-3 border rounded mb-4 flex-col"
                        >
                            {/* Product Image and Details */}
                            <div className="flex items-center justify-between">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded mr-4"
                                    width={80}
                                    height={80}
                                    />
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-gray-600 text-sm">Size: {item.variantName}</p>
                                    {/* Price and Quantity */}
                                    <div className="flex flex-col">
                                        <span className="text-gray-800 mr-6 font-bold">
                                            Rs. {(item.price * item.qty).toFixed(2)}
                                        </span>
                                        <div className='flex'>
                                            <div className="flex items-center border rounded">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(item)}
                                                    className="px-2 py-1 border-r hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.qty}
                                                    readOnly
                                                    className="w-10 text-center border-none focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => handleIncreaseQuantity(item)}
                                                    className="px-2 py-1 border-l hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className="text-red-500 ml-4"
                                                onClick={() => handleRemoveItem(item)}
                                            >
                                                <RiDeleteBinLine />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))
                )}
                <Link href={'/'}>
                    <Button text={'Continue Shopping'}>
                    </Button>
                </Link>
            </div>

            {/* Summary and Promotion Code Section */}
            <div className="w-full md:w-1/3 md:pl-8 mt-6 md:mt-0">
                <h2 className="text-lg font-semibold mb-4">Promotion Code</h2>
                <div className="border p-4 rounded mb-4">
                    <input
                        type="text"
                        placeholder="Promo code"
                        className="w-full border rounded p-2 mb-4 focus:outline-none"
                    />
                    <Button text={'Apply'}>
                    </Button>
                </div>
                <div className="border p-4 rounded mb-4">
                    <ul className="space-y-2">
                        <li className="flex justify-between">
                            <span>{totalQuantity} items</span>
                            <span>Rs. {totalAmount.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Shipping</span>
                            <span>Rs. {shipping.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between border-t pt-2">
                            <span>Total (tax excl.)</span>
                            <span>Rs. {totalPrice.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between font-semibold border-t pt-2">
                            <span>Total (tax incl.)</span>
                            <span>Rs. {totalPrice.toFixed(2)}</span>
                        </li>
                        <li className="text-right text-sm text-gray-500">Taxes: Rs. 0.00</li>
                    </ul>
                </div>
                <Button text={'Proceed To Checkout'}>
                </Button>
            </div>
        </div>
    );
};

export default Cart;
