import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItemsAsync,
  addItemToCartAsync,
  removeItemFromCartAsync,
} from "../store/slices/cart";
import Link from "next/link";
import Button from "@/components/UI/Button";
import { getSessionId } from "@/store/LocalStorage";

const Cart = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    disable: false,
    discountInput: "",
    discountApplied: false,
    discountError: "",
    discount: 0,
    hasFetchedOnce: false,
  });

  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  useEffect(() => {
    if (!state.hasFetchedOnce) {
      dispatch(fetchCartItemsAsync()).then(() => {
        setState((prev) => ({ ...prev, hasFetchedOnce: true }));
      });
    }
  }, [state.hasFetchedOnce, dispatch]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      disable: totalQuantity === 0,
    }));
  }, [totalQuantity]);

  const handleDiscountChange = (e) => {
    setState((prev) => ({
      ...prev,
      discountInput: e.target.value,
    }));
  };

  const handleApplyDiscount = async () => {
    try {
      const res = await fetch(
        `${base_url}/store/${brand_id}/auth/checkout/discount`,
        {
          method: "POST",
          headers: { session: getSessionId() },
          body: JSON.stringify({ code: state.discountInput }),
        }
      );
      if (!res.ok) throw new Error("Failed to apply discount");
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        discountInput: "",
        discountApplied: true,
        discountError: "",
        discount: data.discountAmt,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        discountInput: "",
        discountApplied: false,
        discountError: "Discount Code is Not Applicable now",
      }));
    }
  };

  const handleAutomaticDiscount = async () => {
    try {
      const res = await fetch(
        `${base_url}/store/${brand_id}/discounts/automatic`,
        {
          method: "GET",
          headers: { session: getSessionId() },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch automatic discount");

      const data = await res.json();
      if (totalAmount > data.discount.minOrder) {
        let discountValue =
          data.discount.discountType === "PERCENT"
            ? Math.min(
                (data.discount.discountVal / 100) * totalAmount,
                data.discount.maxDiscount
              )
            : data.discount.discountVal;

        setState((prev) => ({
          ...prev,
          discount: discountValue,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch automatic discount", error);
    }
  };

  useEffect(() => {
    handleAutomaticDiscount();
  }, [totalAmount]);

  const handleIncreaseQuantity = (item) => {
    dispatch(addItemToCartAsync(item));
  };

  const handleDecreaseQuantity = (item) => {
    if (item.qty > 1) {
      dispatch(removeItemFromCartAsync(item));
    } else if (item.qty === 1) {
      dispatch(removeItemFromCartAsync(item));
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 max-w-5xl mx-auto">
      <div className="w-full md:w-2/3">
        <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={`${item.id || "unknown"}-${item.size || "unknown"}`}
              className="flex px-4 py-3 border rounded mb-4 flex-col"
            >
              <div className="flex items-center justify-between">
                <img
                  src={item.image || ""}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                  width={80}
                  height={80}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Size: {item.variantName}
                  </p>
                  <div className="flex flex-col">
                    <span className="text-gray-800 mr-6 font-bold">
                      Rs. {(item.price * item.qty).toFixed(2)}
                    </span>
                    <div className="flex">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <Link href={"/"}>
          <Button text={"Continue Shopping"}></Button>
        </Link>
      </div>

      {/* Summary and discount Code Section */}
      <div className="w-full md:w-1/3 md:pl-8 mt-6 md:mt-0">
        <h2 className="text-lg font-semibold mb-4">Discount</h2>
        <div className="border p-4 rounded mb-4">
          {state.discountApplied ? (
            <>
              <p className="text-green-500 text-sm">
                Discount code applied successfully.
              </p>
              <p className="text-gray-600 text-sm">
                Discount: -Rs. {state.discount}
              </p>
            </>
          ) : (
            <p className="text-red-500 text-sm">{state.discountError}</p>
          )}
          <input
            type="text"
            placeholder="Discount code"
            className="w-full border rounded p-2 mb-4 focus:outline-none"
            onChange={handleDiscountChange}
            value={state.discountInput}
            disabled={state.disable}
          />
          <Button
            text={"Apply"}
            disabled={state.disable}
            onClick={handleApplyDiscount}
          ></Button>
        </div>
        <div className="border p-4 rounded mb-4">
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>{totalQuantity} items</span>
              <span>Rs. {totalAmount.toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span>Discount</span>
              <span>Rs. {state.discount}</span>
            </li>
            <li className="flex justify-between border-t pt-2">
              <span>Total</span>
              <span>Rs. {(totalAmount - state.discount).toFixed(2)}</span>
            </li>
          </ul>
        </div>
        <Link href={"/user/checkout"}>
          <Button
            text={"Proceed To Checkout"}
            disabled={state.disable}
          ></Button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
