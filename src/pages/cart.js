import React from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { increaseItemQuantity, decreaseItemQuantity, removeItemFromCart } from '../store/slices/cart';
import Link from 'next/link';
import Button from '@/components/UI/Button';

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const totalAmount = useSelector((state) => state.cart.totalAmount);
    const shipping = 7.0;
    const totalPrice = totalAmount + shipping;

    const handleIncreaseQuantity = (item) => {
        dispatch(increaseItemQuantity({ id: item.id, size: item.size }));
    };

    const handleDecreaseQuantity = (item) => {
        if (item.quantity > 1) {
            dispatch(decreaseItemQuantity({ id: item.id, size: item.size }));
        }
    };

    const handleRemoveItem = (item) => {
        dispatch(removeItemFromCart({ id: item.id, size: item.size }));
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
                            className="flex items-center justify-between p-4 border rounded mb-4"
                        >
                            {/* Product Image and Details */}
                            <div className="flex items-center">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded mr-4"
                                    width={80}
                                    height={80}
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-gray-600 text-sm">Size: {item.size}</p>
                                </div>
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex items-center">
                                <span className="text-gray-800 mr-6">
                                    Rs. {item.offerPrice.toFixed(2)}
                                </span>
                                <div className="flex items-center border rounded">
                                    <button
                                        onClick={() => handleDecreaseQuantity(item)}
                                        className="px-2 py-1 border-r hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        value={item.quantity}
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
                                <span className="text-gray-800 ml-6">
                                    Rs. {(item.offerPrice * item.quantity).toFixed(2)}
                                </span>
                                <button
                                    className="text-red-500 ml-4"
                                    onClick={() => handleRemoveItem(item)}
                                >
                                    ×
                                </button>
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